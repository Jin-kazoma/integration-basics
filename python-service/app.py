from flask import Flask, request, jsonify 
 
app = Flask(__name__) 
 
@app.route('/calculate', methods=['POST']) 
def calculate(): 
    """ 
    API Endpoint: /calculate 
    Method: POST 
    Input: JSON with num1, num2, and operation 
    Output: JSON with calculation result 
     
    Example Input: 
    { 
        "num1": 15, 
        "num2": 5, 
        "operation": "multiply" 
    } 
     
    Example Output: 
    { 
        "status": "success", 
        "input": { ... }, 
        "result": 75, 
        "message": "Python processed your request!" 
    } 
    """ 
    # Step 1: Extract data from request 
    data = request.get_json() 
    num1 = data.get('num1', 0) 
    num2 = data.get('num2', 0) 
    operation = data.get('operation', 'add') 
     
    # Step 2: Process data (business logic) 
    if operation == 'add': 
        result = num1 + num2 
    elif operation == 'subtract': 
        result = num1 - num2 
    elif operation == 'multiply': 
        result = num1 * num2 
    elif operation == 'divide': 
        result = num1 / num2 if num2 != 0 else "Error: Division by zero" 
    elif operation == 'modulo': #new operations 
        result = num1 % num2
    elif operation == 'power':
        result = num1 ** num2
    elif operation == 'square_root':
        result = num1 ** 0.5    
    else: 
        result = "Invalid operation" 
     
    # Step 3: Return response 
    return jsonify({ 
        'status': 'success', 
        'input': data, 
        'result': result, 
        'message': 'Python processed your request!' 
    }) 
 
@app.route('/ping', methods=['GET']) 
def ping(): 
    """Health check endpoint to verify Python service is running""" 
    return jsonify({'status': 'Python is running!'}) 
 
if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5001, debug=True)