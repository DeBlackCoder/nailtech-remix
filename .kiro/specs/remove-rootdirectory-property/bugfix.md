# Bugfix Requirements Document

## Introduction

Vercel deployment fails with the error `"Invalid request: should NOT have additional property 'rootDirectory'. Please remove it."` The root-level `vercel.json` contains `{"rootDirectory": "nailtech"}`, but the Next.js project files (`package.json`, `app/`, etc.) live at the repository root — not inside a `nailtech/` subdirectory. The `rootDirectory` property is therefore both incorrect and unsupported in this configuration, causing every deployment attempt to be rejected.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Vercel processes the deployment and reads `vercel.json` at the repository root THEN the system rejects the deployment with the error `"Invalid request: should NOT have additional property 'rootDirectory'. Please remove it."`

1.2 WHEN `vercel.json` contains `{"rootDirectory": "nailtech"}` and the Next.js project files are at the repository root THEN the system fails to deploy the application

### Expected Behavior (Correct)

2.1 WHEN Vercel processes the deployment and reads `vercel.json` at the repository root THEN the system SHALL accept the configuration and proceed with the deployment without errors

2.2 WHEN `vercel.json` does not contain the `rootDirectory` property and the Next.js project files are at the repository root THEN the system SHALL successfully deploy the application

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the application is deployed to Vercel after the fix THEN the system SHALL CONTINUE TO serve the Next.js application correctly

3.2 WHEN `vercel.json` is present at the repository root THEN the system SHALL CONTINUE TO apply any remaining valid Vercel configuration settings
