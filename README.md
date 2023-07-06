# hello-lambda-pipeline
* A sample cdk pipeline to build lambda resource. 
* Modify config/config.yaml file to add your AWS account and region.
* Please follow this article https://medium.com/p/364d82ee2d0d for details

# To build
npx yarn install
npx cdk synth
npx cdk deploy --all

# To cleanup
npx cdk destroy --all
