export interface Category {
    path: string;
    text: string;
    subcategories: Array<Category>;

}