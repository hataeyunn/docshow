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
import { MedicalRecordService } from './MedicalRecord.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './MedicalRecord.component.html',
  styleUrls: ['./MedicalRecord.component.css'],
  providers: [MedicalRecordService]
})
export class MedicalRecordComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  medicalRecordID = new FormControl('', Validators.required);
  disease = new FormControl('', Validators.required);
  medicalContents = new FormControl('', Validators.required);
  patientID = new FormControl('', Validators.required);
  doctorID = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);

  constructor(public serviceMedicalRecord: MedicalRecordService, fb: FormBuilder) {
    this.myForm = fb.group({
      medicalRecordID: this.medicalRecordID,
      disease: this.disease,
      medicalContents: this.medicalContents,
      patientID: this.patientID,
      doctorID: this.doctorID,
      date: this.date
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceMedicalRecord.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.cap.doc.MedicalRecord',
      'medicalRecordID': this.medicalRecordID.value,
      'disease': this.disease.value,
      'medicalContents': this.medicalContents.value,
      'patientID': this.patientID.value,
      'doctorID': this.doctorID.value,
      'date': this.date.value
    };

    this.myForm.setValue({
      'medicalRecordID': null,
      'disease': null,
      'medicalContents': null,
      'patientID': null,
      'doctorID': null,
      'date': null
    });

    return this.serviceMedicalRecord.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'medicalRecordID': null,
        'disease': null,
        'medicalContents': null,
        'patientID': null,
        'doctorID': null,
        'date': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.cap.doc.MedicalRecord',
      'disease': this.disease.value,
      'medicalContents': this.medicalContents.value,
      'patientID': this.patientID.value,
      'doctorID': this.doctorID.value,
      'date': this.date.value
    };

    return this.serviceMedicalRecord.updateAsset(form.get('medicalRecordID').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteAsset(): Promise<any> {

    return this.serviceMedicalRecord.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

    return this.serviceMedicalRecord.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'medicalRecordID': null,
        'disease': null,
        'medicalContents': null,
        'patientID': null,
        'doctorID': null,
        'date': null
      };

      if (result.medicalRecordID) {
        formObject.medicalRecordID = result.medicalRecordID;
      } else {
        formObject.medicalRecordID = null;
      }

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
      'medicalRecordID': null,
      'disease': null,
      'medicalContents': null,
      'patientID': null,
      'doctorID': null,
      'date': null
      });
  }

}
