import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import matchStudents from "@/components/matchStudents";
import { Student, Match } from "@/components/matchStudents";



export default function docDataToStudent(doc: DocumentSnapshot<DocumentData>): Student{
    
        const data = doc.data();
        if (!data) throw new Error("No data found in document");
    
        return {
          id: doc.id,
          name: data.name || "",
          university: data.university || "",
          courses: data.courses || "",
          availability: data.availability || "",
          studyStyle: data.studyStyle || "",
          image: data.image || "",
        };
      }