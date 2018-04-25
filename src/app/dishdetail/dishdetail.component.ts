import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

import 'rxjs/add/operator/switchmap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
	
	dish: Dish;
	dishIds: number[];
	prev: number;
	next: number;
	commentForm: FormGroup;
	errMess: string;
	
	formErrors = {
		'author': '',
		'rating': 5,
		'comment': '',
		'date':''
	};
	
	validationMessages = {
		'author': {
			'required': 'Author name is required.',
			'minlength': 'Author name must be at least 2 characters long'
		},
		'comment': {
			'required': 'A comment is required.',
		}
	};
	
	constructor(private dishservice: DishService,
		private route: ActivatedRoute,
		private location: Location,
		private fb: FormBuilder,
		@Inject('BaseURL') private BaseURL) { }

	ngOnInit() {
		this.dishservice.getDishIds()
			.subscribe(dishIds => this.dishIds = dishIds);
		
		this.route.params
			.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
			.subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id) },
			errMess => this.errMess = <any>errMess);
			
		this.createForm();
	}
	
	createForm() {
	  this.commentForm = this.fb.group({
		author: ['', [Validators.required, Validators.minLength(2)]],
		rating: 5,
		comment: ['', [Validators.required]],
		date:''
	  });
	  
	  this.commentForm.valueChanges
		.subscribe(data => this.onValueChanged(data));
		
		this.onValueChanged(); 
	}
	
	onValueChanged(data?: any) {
		if (!this.commentForm) { return; }
		const form = this.commentForm;
		
		
		for (const field in this.formErrors) {
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}
		
	
	setPrevNext(dishId: number) {
		let index = this.dishIds.indexOf(dishId);
		this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
		this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
	}
	
	goBack(): void {
		this.location.back();
	}
	
	onSubmit() {

		console.log(this.commentForm.value);
		var nowDate = new Date().toISOString();
		
		//push the comment to the dish's comments array
		this.dish.comments.push({
			author: this.commentForm.value.author,
			rating: this.commentForm.value.rating,
			comment: this.commentForm.value.comment,
			date: nowDate
		});

		this.commentForm.reset({
			author: '',
			rating: 5,
			comment: '',
			date:''
		});
	}

}
