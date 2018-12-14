import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.cap.doc{
   export class MedicalRecord extends Asset {
      medicalRecordID: string;
      disease: string;
      medicalContents: string;
      patientID: string;
      doctorID: string;
      date: string;
   }
   export class CreateMedicalRecord extends Transaction {
      disease: string;
      medicalContents: string;
      patientID: string;
      doctorID: string;
      date: string;
   }
   export class getUserType extends Transaction {
      patientID: string;
   }
// }
