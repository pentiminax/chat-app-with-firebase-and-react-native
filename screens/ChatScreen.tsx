import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Text, TouchableOpacity } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IMessage, GiftedChat } from "react-native-gifted-chat";
import { useAuth } from "../hooks/useAuth";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import firebase from "../firebase/firebase";

type ChatScreenNavigationProp = NativeStackNavigationProp<{}>;

interface ChatScreenProps {
    navigation: ChatScreenNavigationProp;
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const user = useAuth();

    const onLogout = async () => {
        await firebase.logout();
    }

    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );

        await firebase.addMessage(messages[0])
    }, []);

    useEffect(() => {
        const q = query(firebase.messagesCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const messages: IMessage[] = querySnapshot.docs.map(doc => ({
                _id: doc.data().id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: { _id: doc.data().userUid }
            }));
            setMessages(messages);
        });

        return () => unsubscribe();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
                    <Text>Déconnexion</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: user?.uid }}
        />
    )
}