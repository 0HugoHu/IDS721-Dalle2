# IDS721-Dalle2

IDS721 Cloud Computing - Team Final Project

## 0. Introduction 

In this project, we build a web application that allows users to enter a prompt, then return a generated image by ***OpenAI DALLE API***. It also allows to edit the image by adding a movable and resizable mask, the selected area is then re-generated with the second prompt. Users can specify the height-width ratio of the returning image.

### 0.1. Technical Features

The application is built using ```Node/Express``` as backend and ```Jade``` as a template engine The frontend is designed with ```TailwindCSS/Flowbite``` and ```Fabric.JS``` (canvas element). While running our Node.js application with node ```bin/www``` is fine for most cases, we want a more robust solution to keep everything running smoothly in production. So we use ```pm2```.

It runs in ```Docker``` for production. The application is deployed on ```AWS ECR``` for Docker image storage, and ```AWS AppRunner``` a cloud platform for static sites and Serverless Functions for auto deployment. 

### 0.2. User Groups
The web application is intended for use by individuals and organizations who require high-quality generated images for various purposes. This includes artists, graphic designers, web developers, and more.

### 0.3. Applications
The generated images can be used for a variety of applications, including but not limited to:
- Art and design projects
- Marketing and advertising campaigns
- Website and social media graphics
- E-commerce product images
- Education and research projects
- And much more!

### 0.4. OpenAI API Key
You have to obtain your OpenAI API Key to request image generations, variations, or edits. 

## 1. Architecture Diagram
![image](./demo-images/diagram.png)

## 2. Demo
### 2.1 Video Demo
[Video Link](https://drive.google.com/file/d/1FmZOWZeAVtkEB4KG-Bgonr8Zi1nStBwl/view?usp=share_link)

### 2.2 Features

- Access Dall-E 2 generation using API.
- **Generation Mode**: Users can submit a prompt and the application will return an image. Users can also customize the aspect ratio from 16:9 (default), 4:3, 3:2, and 1:1 to suit their needs.
![image](./demo-images/generate1.png)

- **Edit Mode**: Users can upload an image, click the eraser button on the left sidebar, and can erase any part of the image! Then with a **new prompt**, the application will return a new image with the erased part re-generated.
![image](./demo-images/modify.png)
![image](./demo-images/new.png)
- **History**: The application keeps a history of all the images generated for easy reference.
- **Save Images**: Users can save the images locally by clicking on the image and then right-clicking to choose ```Save image as```.

## 3. Getting Started

This project is built into Docker image, but if your want to deploy it locally, here's the guide:

First, install ```node.js``` by ```brew``` on Mac platform:

```bash
brew update
brew install node
```
Then, check your node version by:

```bash
node -v
```
<!-- You must have ```19.0.0 >= node >= 12.0.0``` (some libraries do not support the latest 20.0 version).  -->

Next, install the required packages:
```bash
npm install
```
Add API key to ```environment.env``` in root folder
```bash
# Obtain from OpenAI!
OPENAI_API_KEY="" 
```
start app
```
npm run build
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the web page.
*(Make sure your Port 8080 is free or you can change the port number in ```bin/www``` file.)*

## 4. Publish to AWS ECR and AppRunner

### 4.1. Build Docker Image

```bash
docker build -t ids721-dalle . 
docker run -it --rm -p 8080:8080 ids721-dalle
```

### 4.2. Push to AWS ECR

Create a new blank ECR image in your AWS dashboard: [AWS ECR](https://us-east-1.console.aws.amazon.com/ecr).

Create a new access key in your AWS IAM dashboard: [AWS IAM](https://us-east-1.console.aws.amazon.com/iamv2).

You need also **grant sufficient permissions** to the key. See this article if you meet any problems: [help](https://www.freecodecamp.org/news/build-and-push-docker-images-to-aws-ecr/).

Install AWS CLI:
```bash
sudo apt-get install awscli
```

Configure your local credentials:
```bash
aws configure
# enter your access key and secrets, select default region: us-east-1
```

Retrieve an authentication token and authenticate your Docker client to your registry.
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_ID.dkr.ecr.us-east-1.amazonaws.com
# replace YOUR_ECR_ID with your image url
```

Tag your image so you can push the image to this repository.
```bash
docker tag hugoweather:latest YOUR_ECR_ID.dkr.ecr.us-east-1.amazonaws.com/hugoweather:latest
# replace YOUR_ECR_ID with your image url
```

Run the following command to push this image to your newly created AWS repository:
```bash
docker push YOUR_ECR_ID.dkr.ecr.us-east-1.amazonaws.com/hugoweather:latest
# replace YOUR_ECR_ID with your image url
```

This picture shows the image pushed to AWS ECR:
![image](./demo-images/ecr.png)

### 4.3. Publish to AWS AppRunner

Create a new AppRunner service: [AWS APPRunner](https://us-east-1.console.aws.amazon.com/apprunner) 

Select the image you built, and choose **Auto Deploy**.

Wait until health check is automatically completed.

This picture shows the image pushed to AWS AppRunner:

![image](./demo-images/apprunner.png)

## 5. Contributors

- [Arthur Chen](https://github.com/ArthurChenCoding)
- [Hugo Hu](https://github.com/0HugoHu)
- [Minghui Zhu](https://github.com/zhuminghui17)
- [Enze Shi](https://github.com/casnz1601)

## 5. License
This project is under the MIT License.
