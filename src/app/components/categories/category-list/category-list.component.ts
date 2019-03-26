import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { element } from 'protractor';
//import {CategoryComponent} from '../../../components/categories/category/category.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categoryList: Category[];

  constructor(public categoryService: CategoryService/* , private submitType: CategoryComponent */) { }

  ngOnInit() {
    this.categoryService.getCategories().snapshotChanges().subscribe(item =>{
      this.categoryList = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.categoryList.push(x as Category);
      });
    });
  }

  onEdit(category: Category){
    //this.submitType. = 'Update';
    this.categoryService.selectedCategory = Object.assign({},category);
  }

  onDelete($key: string){
    this.categoryService.deleteCategory($key);
  }

}
