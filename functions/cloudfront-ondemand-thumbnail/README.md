# On-demand CloudFront thumbnail

참조: https://engineering.huiseoul.com/lambda-한개로-만드는-on-demand-image-resizing-d48167cc1c31

## package 설치
람다 환경을 위해 다음과 같이 설치한다.
$ npm install --arch=x64 --platform=linux --target=8.10.0 sharp

## 설정
index.js 파일의 region, bucket 부분을 수정한다.

## depoly
index.js, node_modules 를 zip 압축하여 업로드한다.
