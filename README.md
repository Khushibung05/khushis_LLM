##**STEP 1 Install Python **
Install: 
Python Python 3.11 
Download: 
Official website: 
https://python.org 
Important: 
During install, check: 
✅
Add Python to PATH 
After install test: 
python --version 
Expected: 
Python 3.11.x 
##**STEP 2 Install Git **
Install: 
Git 
Check: 
git --version 
##**STEP 3 Install VS Code **
Install: 
Visual Studio Code 
Extensions later. 
##**STEP 4 Install Ollama **
Install: 
Ollama -> install .exe file in ollama official website 
Why: 
● Run Phi-2 locally  
● Test models easily  
● Later use custom fine-tuned model  
Install from official site. 
After install: 
ollama --version 
##**STEP 5 Create Project Folder **
mkdir coding-llm 
cd coding-llm 
STEP 6 Create Virtual Environment 
python -m venv venv 
venv\Scripts\activate 
##**STEP 7 Install Libraries **
Run: 
pip install --upgrade pip 
pip install transformers datasets peft accelerate torch sentencepiece 
STEP 8 Test Phi-2 Quickly in Ollama 
Run: 
ollama run phi 
If phi unavailable: 
ollama pull phi 
ollama run phi 
Ask: 
Write Python program for bubble sort

##**Create file: **
coding_dataset.json 
Each line = one JSON object 
Example: 
{"instruction":"What is Python list?","input":"","output":"Python list is 
ordered mutable collection..."} 
{"instruction":"Write Java factorial program","input":"","output":"public 
class Main {...}"} 
{"instruction":"Explain React useState","input":"","output":"useState manages 
state in functional components..."}

##**vs-window-1**
python generate_dataset.py 
python train_phi2.py 
pip install fastapi uvicorn 
uvicorn api:app --reload 
python chat.py

##vs-window-2**
npx create-react-app coding-ai-ui 
cd coding-ai-ui 
npm install 
change App.js and App.css
npm start
