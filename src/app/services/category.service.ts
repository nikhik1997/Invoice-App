import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class CategoryService {

  categoryList: AngularFireList<any>;
  selectedCategory: Category = new Category();

  

  constructor(private firebase: AngularFireDatabase) { }

  getCategories(){
    return this.categoryList = this.firebase.list('categories');
  }

  insertCategory(category: Category)
  {
    this.categoryList.push({
      name: category.name,
      description: category.description     
    });
  }

  updateCategory(category: Category)
  {
    this.categoryList.update(category.$key,{
      name: category.name,
      description: category.description   
    });
  }

  deleteCategory($key: string){
    this.categoryList.remove($key);
  }




}
