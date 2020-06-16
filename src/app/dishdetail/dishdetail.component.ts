import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('dishForm')  dishcommentFormDirective;
  dishcommentForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;



  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) {
                this.createForm();
              }

  createForm() {
    this.dishcommentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)] ],
      comment: ['' , [Validators.required]],
      rating: '5'
    });
    // tslint:disable-next-line: deprecation
    this.dishcommentForm.valueChanges.subscribe(data => console.log(data));
  }


  ngOnInit(): void {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params.id)))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
  onSubmit() {
    this.comment = this.dishcommentForm.value;
    const d = new Date();
    const date = d.toISOString();
    this.comment.date = date;
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.dishcommentForm.reset({
      name: '',
      comment: '',
      rating: '5'
    });
    this.dishcommentFormDirective.resetForm();
  }
}
