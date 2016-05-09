export interface Category {
    path: string;
    text: string;
    subcategory: Array<Category>;

}