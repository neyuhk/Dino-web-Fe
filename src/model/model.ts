export interface Project {
    _id: string;
    name: string;
    description: string;
    direction: string;
    images: string[];
    user_id: User;
    like_count: number;
    view_count: number;
    project_type: string;
    createdAt: string;
    updatedAt: string;
    blocks: string;
}

export interface User {
    _id: string;
    email: string;
    username: string;
    name: string;
    avatar: string[];
    role: string;
    createdAt: string;
    updatedAt: string;
    birthday: Date;
    phonenumber: string;
}

export interface CourseReq {
    title: string;
    description: string;
    images: string[];
    start_date: string;
    end_date: string;
}

export interface Comment {
    _id: string;
    content: string;
    user_id: User;
    commentable_id: Project;
    commentable_type: string;
    like_count: number;
    sub_comments: SubComment[];
    parent_id: string;
    createdAt: string;
}

export interface SubComment {
    _id: string;
    content: string;
    user_id: User;
    commentable_id: Project;
    commentable_type: string;
    like_count: number;
    parent_id: string;
    createdAt: string;
}

export interface CommentReq {
    content: string;
    commentableId: string;
    commentableType: string;
    userId: string;
    parentId: string;
}

export interface Forum {
    _id: string;
    title: string;
    description: string;
    user_id: User;
    like_count: number;
    view_count: number;
    comment_count: number;
    repost_count: number;
    is_liked: boolean;
    is_reposted: boolean;
    images: string[];
    createdAt: string;
}
