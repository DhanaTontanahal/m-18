# Use an official Python image as the base
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Ensure the extracted_images folder exists-added when deploying to cloudrun
RUN mkdir -p /app/static/extracted_images

# Copy extracted images into the container (ensure they exist before building)-added when deploying to cloudrun
COPY static/extracted_images /app/static/extracted_images

# Copy the entire project into the container
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
