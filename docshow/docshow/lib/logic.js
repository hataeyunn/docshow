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

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Create record Transaction
 * @param {org.cap.doc.CreateMedicalRecord} recordData
 * @transaction
 */
function CreateMedicalRecord(recordData) {
  // Get the Asset Registry
  return getAssetRegistry('org.cap.doc.MedicalRecord')
      .then(function(medicalRecordRegistry){
          var  factory = getFactory();
          var  NS =  'org.cap.doc';
          var  medicalRecordID = generatemedicalRecordID(recordData.patientID);
          var  medicalRecord = factory.newResource(NS,'MedicalRecord',medicalRecordID);
          medicalRecord.disease = recordData.disease;
          medicalRecord.medicalContents = recordData.medicalContents;
          medicalRecord.patientID = recordData.patientID;
          medicalRecord.doctorID = recordData.doctorID;
          medicalRecord.date = recordData.date;
          // 4. Add to registry
          return medicalRecordRegistry.add(medicalRecord);
      });
}


/****
* Creates the medical record 
*/
function generatemedicalRecordID(patientID){
  var number = Math.random()/999999;
  var id = patientID+number;
  return id;
}
