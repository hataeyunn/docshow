/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CreateMedicalRecordService } from './CreateMedicalRecord.service';
import 'rxjs/add/operator/toPromise';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-createmedicalrecord',
  templateUrl: './CreateMedicalRecord.component.html',
  styleUrls: ['./CreateMedicalRecord.component.css'],
  providers: [CreateMedicalRecordService]
 
})
export class CreateMedicalRecordComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  disease = new FormControl('', Validators.required);
  medicalContents = new FormControl('', Validators.required);
  patientID = new FormControl('', Validators.required);
  doctorID = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceCreateMedicalRecord: CreateMedicalRecordService, fb: FormBuilder) {
    this.myForm = fb.group({
      disease: this.disease,
      medicalContents: this.medicalContents,
      patientID: this.patientID,
      doctorID: this.doctorID,
      date: this.date,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCreateMedicalRecord.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.cap.doc.CreateMedicalRecord',
      'disease': crypto.AES.encrypt(this.disease.value, this.patientID.value).toString(),
      'medicalContents': crypto.AES.encrypt(this.medicalContents.value, this.patientID.value).toString(),
      'patientID': this.patientID.value,
      'doctorID': crypto.AES.encrypt(this.doctorID.value, this.patientID.value).toString(),
      'date': crypto.AES.encrypt(this.date.value, this.patientID.value).toString(),
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'disease': null,
      'medicalContents': null,
      'patientID': null,
      'doctorID': null,
      'date': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceCreateMedicalRecord.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'disease': null,
        'medicalContents': null,
        'patientID': null,
        'doctorID': null,
        'date': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.cap.doc.CreateMedicalRecord',
      'disease': this.disease.value,
      'medicalContents': this.medicalContents.value,
      'patientID': this.patientID.value,
      'doctorID': this.doctorID.value,
      'date': this.date.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceCreateMedicalRecord.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  deleteTransaction(): Promise<any> {

    return this.serviceCreateMedicalRecord.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCreateMedicalRecord.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'disease': null,
        'medicalContents': null,
        'patientID': null,
        'doctorID': null,
        'date': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.disease) {
        formObject.disease = result.disease;
      } else {
        formObject.disease = null;
      }

      if (result.medicalContents) {
        formObject.medicalContents = result.medicalContents;
      } else {
        formObject.medicalContents = null;
      }

      if (result.patientID) {
        formObject.patientID = result.patientID;
      } else {
        formObject.patientID = null;
      }

      if (result.doctorID) {
        formObject.doctorID = result.doctorID;
      } else {
        formObject.doctorID = null;
      }

      if (result.date) {
        formObject.date = result.date;
      } else {
        formObject.date = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'disease': null,
      'medicalContents': null,
      'patientID': null,
      'doctorID': null,
      'date': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
