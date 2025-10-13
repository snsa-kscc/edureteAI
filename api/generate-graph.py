import json
import base64
import io
import sys
import os
import traceback
import warnings
from typing import Dict, Any

# Set matplotlib config directory to /tmp for serverless environments
os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib'

# Suppress warnings
warnings.filterwarnings('ignore')

import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend

# Ensure matplotlib uses /tmp for cache
import matplotlib.pyplot as plt
plt.rcParams['savefig.directory'] = '/tmp'
import numpy as np
import scipy
import math

# For Vercel compatibility, we still need the handler class
from http.server import BaseHTTPRequestHandler

# FastAPI imports (for local testing)
try:
    from pydantic import BaseModel
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False

# Core graph generation function
def generate_graph(code: str) -> Dict[str, Any]:
    """Core function to generate matplotlib graphs from code."""
    try:
        if not code:
            raise ValueError('No code provided')

        # Create a buffer to capture the plot
        img_buffer = io.BytesIO()
        
        # Set up matplotlib with better defaults
        plt.figure(figsize=(10, 6), dpi=100)
        
        # Prepare execution environment with common libraries
        exec_globals = {
            'plt': plt,
            'np': np,
            'numpy': np,
            'scipy': scipy,
            'math': math,
            'matplotlib': matplotlib,
            'io': io,
            '__name__': '__main__'
        }
        
        # Capture stdout for any print statements
        old_stdout = sys.stdout
        stdout_capture = io.StringIO()
        sys.stdout = stdout_capture
        
        try:
            # Execute user code
            exec(code, exec_globals)
            
            # Save plot to buffer
            plt.tight_layout()
            plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight',
                       facecolor='white', edgecolor='none')
            
            # Get stdout output
            stdout_output = stdout_capture.getvalue()
            
        finally:
            # Restore stdout
            sys.stdout = old_stdout
            plt.close('all')  # Clean up all figures
        
        # Convert to base64
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        img_buffer.close()
        
        return {
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'stdout': stdout_output,
            'stderr': ''
        }
        
    except Exception as e:
        error_msg = str(e)
        traceback_msg = traceback.format_exc()
        
        # Clean up any open figures
        plt.close('all')
        
        return {
            'success': False,
            'error': error_msg,
            'traceback': traceback_msg,
            'stdout': '',
            'stderr': traceback_msg
        }

# FastAPI app (for local testing)
if FASTAPI_AVAILABLE:
    
    # Pydantic model for request
    class GraphRequest(BaseModel):
        code: str
    
    app = FastAPI(title="Graph Generator API", version="1.0.0")
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.post("/")
    async def generate_graph_endpoint(request: GraphRequest):
        """Generate a matplotlib graph from Python code."""
        result = generate_graph(request.code)
        
        if not result['success']:
            raise HTTPException(status_code=400, detail=result)
        
        return result
    
    @app.get("/")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "message": "Graph generator is running"}

# Vercel handler class (for deployment)
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "healthy", "message": "Graph generator is running"}).encode('utf-8'))
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            try:
                data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self._send_error_response(400, 'Invalid JSON')
                return

            code = data.get('code', '')
            result = generate_graph(code)
            
            if result['success']:
                self._send_success_response(result)
            else:
                self._send_error_response(400, result)
            
        except Exception as e:
            error_msg = str(e)
            traceback_msg = traceback.format_exc()
            
            # Clean up any open figures
            plt.close('all')
            
            # Send error response
            self._send_error_response(400, {
                'success': False,
                'error': error_msg,
                'traceback': traceback_msg,
                'stdout': '',
                'stderr': traceback_msg
            })
    
    def _send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _send_error_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        if isinstance(data, str):
            data = {'success': False, 'error': data}
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# For local testing with FastAPI
if __name__ == "__main__" and FASTAPI_AVAILABLE:
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
