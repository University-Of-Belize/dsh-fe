interface MessageObj {
    // MongoDB generates IDs by default
    subject: string;
    content: string;
};

interface Message {
    user: string;
    message: MessageObj;
};

interface UserDetailsMessage {
    username: string;
    channel_id: string;
    profile_picture: string | undefined;
    banner: string | undefined;
}

interface ServerMessage {
    _id: string;
    subject: string;
    content: string;
    from_user: UserDetailsMessage | undefined;
    to_user: UserDetailsMessage | undefined;
}

export type { Message, MessageObj, ServerMessage, UserDetailsMessage };