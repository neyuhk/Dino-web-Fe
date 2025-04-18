import { COMMENT_API } from '../constants/api.ts'
import http from '@/services/http/http'
import { CommentReq } from '../model/model.ts'
import httpAuth from './http/httpAuth.ts'

export const getCommentsByCommentableId = async (commentableId: string) => {
    return (await http.get(COMMENT_API.GET_COMMENTS + commentableId)).data
}

export const addComment = async (comment: CommentReq) => {
    console.log(comment)
    return await httpAuth.post(COMMENT_API.CREATE_COMMENT, comment);
}

export const deleteComment = async (commentId: string) => {
    return await httpAuth.delete(COMMENT_API.DELETE_COMMENT + commentId);
}

export const likeComment = async (commentId: string, userId: string) => {
    return await httpAuth.post(COMMENT_API.LIKE_COMMENT, {commentId, userId});
}
