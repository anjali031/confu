import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

    constructor(private dishservice: DishService,
                private route: ActivatedRoute,
                private location: Location,
                private fb: FormBuilder) {
                  this.createForm();
                }

  @ViewChild('fform') commentFormDirective;

    commentForm: FormGroup;
    comment: Comment;
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;

    formErrors = {
      'author': '',
      'comment': '',
    };

    validationMessages = {
      'author': {
        'required':      'First Name is required.',
        'minlength':     'First Name must be at least 2 characters long.',
        'maxlength':     'FirstName cannot be more than 100 characters long.'
      },
      'comment': {
        'required':      'Last Name is required.',
        'minlength':     'Last Name must be at least 2 characters long.',
      }
    };

    ngOnInit() {
       this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
       this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
       .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    goBack(): void {
      this.location.back();
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        comment: ['', [Validators.required, Validators.minLength(2)]],
        rating: '5',
      });

      this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      this.dish.comments.push(this.comment);
      console.log(this.comment);
      this.commentForm.reset({
        author: '',
        rating: '5',
        comment: '',
      });
      this.commentFormDirective.resetForm();
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
}
