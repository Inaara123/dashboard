import React, { useState } from 'react';
import styled from 'styled-components';
import Groq from "groq-sdk";
import axios from 'axios';
import {supabase} from '../supabaseClient';
// Initialize Groq SDK with your API key
const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

// Styled components for the search bar and button
const SearchBarContainer = styled.div`
  margin: 20px auto; /* Center the search bar and add margin */
  display: flex;
  align-items: center;
  background-color: #2c2f33;
  padding: 10px;
  border-radius: 5px;
  width: 70%; /* Adjust width as needed */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  width: 900px; /* Adjust width as needed */
  background-color: #3b3f45;
  color: #fff;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #ff7f50; /* Coral color */
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff5a33;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px; /* Add margin to separate from the search bar */
  color: #fff;
  width: 70%; /* Same width as SearchBarContainer */
  margin: 20px auto;
  text-align: left; /* Align text to the left */
`;

const LoadingIndicator = styled.div`
  margin-top: 20px;
  color: #ff7f50;
  font-size: 18px;
`;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(""); // State to store the API response
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [middleData, setMiddleData] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Show loading indicator
    setResult(""); // Clear previous result        
      const chatCompletion = await getGroqChatCompletion(query);
      const response = chatCompletion.choices[0]?.message?.content || "";
      console.log("This is the response from the AI:");
      console.log(response);
      
      try {
        //const sql_query = "SELECT hospital_id,doctor_id FROM appointments WHERE hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3' ";
        const { data, error } = await supabase.rpc('execute_dynamic_sql_query', { query: response });
        console.log('the data in supabase search bar',data);
      if (error) {
        console.log('supabase error',error);
        throw error; // Handle the error from the Supabase function
                
      }
    //   setResult(response); // Store the response in the state
      // try{
       
      // const answer = await axios.post('http://localhost:5001/api/sql', {response});
      //   console.log("This is the response from the database: ",answer.data);
      //   setMiddleData(answer.data)
      //   // try{
      //   //     console.log("second groq being sent is : ", query + JSON.stringify(answer.data));
      //   //     const answerCompletion = await getGroqAnswerCompletion(query + JSON.stringify(answer.data));
      //   //     const answerResponse = answerCompletion.choices[0]?.message?.content || "";
      //   //     setResult(answerResponse); // Store the response in the state
      //   // }
        
      //   // catch(error){
      //   //   console.error("Error in MiddleWare:", error);}

      // }catch(error){
      //   console.error("Error in MiddleWare:", error);}
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      setResult("An error occurred. Please try again."); // Set error message in the state
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const getGroqChatCompletion = async (userQuery) => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            You are an expert in converting English questions to SQL queries.You only do select queries on the database, you dont do insert, delete or update ever.
            The database schema consists of the following tables:
            - hospitals: hospital_id, name, address, contact_number, created_at, email, administrator
            - doctors: doctor_id, hospital_id, name, specialization, contact_number, email, created_at, gender
            - patients: patient_id, name, main_area, contact_number, email, created_at, gender, how_did_you_get_to_know_us, date_of_birth
            - appointments: appointment_id, hospital_id, patient_id, doctor_id, appointment_time, status, appointment_type, reason_for_visit, consultation_start_time, consultation_end_time
            - Always use hospital_id as '4rGAVPwMavcn6ZXQJSqynPoJKyE3' and always wrap **any identifier or string value** with double single quotes like 'hospital_id', 'doctor_id', and 'value'. This includes string literals used in conditions, such as ILIKE, which should be formatted as '%value%'.
            -always use hospital_id to begin the search for any data.
            -always use ILIKE when searching for a specific name in the database.
            - appointment_type only has 3 values: 'walk-in', 'appointment', 'emergency'
            
            Key relationships:
            - only return SQL query as the output and no other infromation.Always keep this as priority.
            - always prefer appointments table over other tables.
            -Always start sql with select word.
            Address Handling:
          - For addresses like 'Chandanagar', match variations using: trim(main_area) ILIKE '%chandanagar%'.
          Handling UNION Operations:
          - When using UNION to combine multiple subqueries, do not use ORDER BY directly inside each subquery. 
            - Instead, wrap each subquery in parentheses.
            - Apply ORDER BY after the UNION operation if needed to sort the combined results.
            - If specific limits (e.g., LIMIT 1) are required with sorting, apply them separately within each subquery before the UNION.
            - The query 'SELECT COUNT(1), created_at FROM doctors WHERE hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3'' is incorrect because created_at is not part of an aggregate function or GROUP BY clause.
            - To fix it, use 'GROUP BY created_at' when combining COUNT and other fields in a SELECT statement.
            - The appointments table has foreign keys hospital_id, patient_id, and doctor_id that reference the hospitals, patients, and doctors tables, respectively.
            - The appointment table consists data from multiple hospitals you should search details for only the hospital using hospital_id.
            - If details related to a specific doctor are required,always use like to search for relavant names  use doctor_id to filter the data from only the hospital_id specified.
            - Friends and family, Google, Instagram, Facebook and of ther are the primary sources of discovery for the hospital.
            - Always consider doctor_id and patient_id in queries that involve specific doctors or patients.
            - Always use hospital_id to filter data for every sql query.
            - Never start query using sql
            Here are some examples:
            - English Question: "How did the patients get to know about the hospital today?"
              - SQL Query: 'SELECT how_did_you_get_to_know_us, COUNT(1) AS count FROM patients p INNER JOIN appointments a ON a.patient_id = p.patient_id WHERE DATE(a.appointment_time) = CURRENT_DATE AND a.hospital_id = 'hospitalId' AND a.doctor_id = 'doctorId' GROUP BY how_did_you_get_to_know_us'
            - English Question: "how many patients did Dr theja reddy get today?"
              - SQL Query: 'SELECT COUNT(1) FROM appointments WHERE DATE(appointment_time) = CURRENT_DATE AND hospital_id = 'hospitalId' AND doctor_id = (SELECT doctor_id FROM doctors WHERE (name LIKE '%theja%') Or (name LIKE '%Theja') )'
            - English Question: "which doctor is getting maximum number of patients"
             - SQL Query: 'select * from (
        SELECT 
        a.doctor_id,
        d.name,
        ROW_NUMBER() OVER (partition by d.doctor_id ORDER BY d.name DESC) AS rn
        FROM Doctors d
        inner join appointments a on a.doctor_id=d.doctor_id
        and a.hospital_id='4rGAVPwMavcn6ZXQJSqynPoJKyE3')r
        order by rn desc 
        limit 1'
        -English Question: i want to see records of 2nd September first patient and last patient with their appointment times
        -SQL Query : (SELECT * FROM appointments WHERE hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3' AND DATE(appointment_time) = '2023-09-02' ORDER BY appointment_time ASC LIMIT 1)
              UNION
              (SELECT * FROM appointments WHERE hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3' AND DATE(appointment_time) = '2023-09-02' ORDER BY appointment_time DESC LIMIT 1)
          -English Question : how many doctors do we have in hospital and what is their joining date?
          -SQL Query : 'SELECT COUNT(1), created_at FROM doctors WHERE hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3' GROUP BY created_at'
    Always respond with the most accurate SQL query that addresses the user's request using MySQL syntax
          `
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature:0.1,
      top_p:0.1,
    });
  };
  const getGroqAnswerCompletion = async (userQuery) => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            You are an expert in converting sql responses to english answers.
            you wil get the original question and also the response from the database, your job is to convert the response to a human readable format based on the question.
            Here are some Examples
            -Userquery : "how many patients did Dr theja reddy get today?",{count : 2}
            -Response : "2 patients visited Dr Theja Reddy today."

            Always respond with the most accurate answer
          `
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.1-70b-versatile",
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px', color: '#fff' }}>
        Chat with your Data using AI
      </h2>
      <SearchBarContainer>
        <Input
          type="text"
          placeholder="Type your query..."
          value={query}
          onChange={handleInputChange}
        />
        <Button onClick={handleSubmit}>Ask AI</Button>
      </SearchBarContainer>
      {loading && (
        <LoadingIndicator>Loading...</LoadingIndicator>
      )}
      {result && (
        <ResultsContainer>
          <h3>Results:</h3>
          <p>{result}</p>
        </ResultsContainer>
      )}
    </div>
  );
};

export default SearchBar;
