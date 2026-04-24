export type MessageStruct = {
    community_id?: string,
    channel_id: string,
    user_id: string,
    message_id: string,
    channel_type: number,
    attachments?: string | null,
    author?: unknown,
    content: string,
    created_at: string,   
}
export type EventStruct = {
    action: string,
    data: unknown,
    channel_id?: string | null,
    community_bots?: number[] | null,
    community_id?: string | null,
    created_at?: string | null,
    message_id?: string | null,
    user_id?: string | null,
}
export type PullMessageResp = {
    im: MessageStruct[],
    event: EventStruct[],
}
export type TeamGagaApiResp<T> = {
    status: boolean,
    code: number,
    message: string,
    data: T,
    request_id: string,
}
