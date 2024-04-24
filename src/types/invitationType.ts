export interface Invitation {
    idInvitation?: number;
    groupId: number;
    recipientId: number;
    senderId: number;
    status: string;
}