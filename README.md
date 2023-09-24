# tiny-hops

<!-- project logo w/ quick links -->
<p align="center">
  <img src="/128x128.png?raw=true" />
</p>
<center>
  <h3 align="center">Tiny Hops</h3>

  <p align="center">
    A workflow specification and runner for executing lilypad enabled jobs in sequence.
    <br />    ·
  </p>
</center>

![tinyhops_gif]()

<!-- table of contents -->
## Table of Contents
  - [About The Project](#about-the-project)
  - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
- [Usage](#usage)
  - [Configurations](#configurations)
  - [Run your first workflow](#run-your-first-workflow)
- [Ultimate Goal](#ultimate-goal)

<!-- about the project -->
## About The Project

[Tiny-Hops](https://github.io/link) is a minimal job runner and specification for Lilypad. It enables you to describe a lilypad job, as well as the input and output to enable automatic sequencing of your lilypad workflow. The goal is to enable projects to share lilypad modules, and to stitch together automatic workflow for powering data transformation. This will enable projects to do simple things like produce assets using deterministic wasm and 

Tiny Hops Features:
- Display job status
- Automatically schedule and execute jobs
- Pause/Halt Workflow
- Describe workflows in a schema validated and shareable way
- Schedule jobs to work in parallel or in series, waiting on results
  
<!-- getting started with the project -->
## Getting Started
### Prerequisites
- node `v18.16` or later
- npm `v7.x.x` or later

### Installation
Clone/ download the project, and install dependencies.
```bash
npm install -g tiny-hops
or
git clone https://github.com/zcstarr/tiny-hops.git && cd tiny-hops && npm instal
```

<!-- example usage, screen shots, demos -->
## Usage

### Install the cli
```bash
npm install -g tiny-hops
tiny-hops --help
```

### Configurations
```bash
tiny-hops generate-template
# outputs sample.thops.json  a JSON schema validated description

```
#### Run your first workflow
Add your private key to the env variable THOPS_PRIVATE_KEY it's required to be able to handle deposits.
```bash
THOPS_PRIVATE_KEY=0x.... tiny-hops run sample.thops --deposit 20
# Outputs your
# Your workflowId is : 2

# here deposit is always in eth just for simplicity, the job will cost less, but there isn't a way to estimate job cost
# practically we must just put a large number here to cover bacalahau job deposit requirements. the number maybe be larger for jobs
# with more flows
```
Once you kick off the work flow you can exit and you're returned a workflow_id , the workflow id will allow you to track the workflow 
you have running

Example: 

#### Monitor work flow 

```bash
THOPS_PRIVATE_KEY=0x.... tiny-hops monitor workflow_id sample.thops.json
# outputs
# Workflow : workflow_id
# Status: Running/ Stopped
# stepName: step 0, stepNo: 0  , jobId: 555 , resultCid: 393883838
# stepName: step 1, stepNo: 1  , jobId: 556 , resultCid: pending
# stepName: step 1b, stepNo: 1 , jobId: 557, resultCid: pending
 .... 
```

#### Stop workflow / Pause workflow 

```
THOPS_PRIVATE_KEY=0x.... tiny-hops pause 2
Override eth url
```

<!-- template just leave alone  -->
## Roadmap
The idea would be to start the prototyping for what a great service running experience would look like. In this example or look ahead, there is an opaque service runner,
that pays for the gas fees to launch future jobs. Right now we take the deposit the user makes and put that as a way to make the future deposits for the subsequent calls to 
the next jobs to run.  You could imagine that this execution would need to have some bounds on the gas cost used to trigger the next run, so we might need a reimbursement contract
in order to make that happen. It's also possible to sidecar this, where we by pass the mediator running the next job, but instead trigger it with a user process that waits for jobs to be complete
and runs the next one offchain.

## Future thoughts
I predict that storage cost for service running on chain will be marginal in the future, so why not leverage the smart contract as storage, for small temporary jobs. 
Does this data have to be fully accessible on chain? 

There is an argument that we could simply emit an event and have that event contain all the data necessary to handle the job. This might reduce some gas cost, at 
the cost of transparency ease of use, and the ability for downstream clients to readily consume job information. 

This kind of contract for lilypad is a pointer to the future for keeping distributed 
compute fully useable for apps to build not that deep workflows on top of.  

Imagine being able to offer your users with minimal overhead access to compute that they pay for to transform their data into 
cool things, without needing to monitor and react/index events. With a simple query to the contract, they can display all the relevant information such as  

### Missing
So here is where things get hard as they rightfully always do, We have a nice and tight syntatic abstraction, but sometimes understanding data is hard. It would be nice to extend this further to include,
an optional metadata specification. The specification should describe all output files, and their consumable data, this might also include a metadata specification for each of hte output files. The hope would 
be to make the surface area of what's being executed and the results produced as accessible as possible, and machine accessible if possible. This is the largest problem with semantic vs syntatic meaning. 
In the issue of scope, this has been avoided, by simply hoping and believing that users are able to understand the data that they've integrated and paid for in a work flow. 

### Ultimate goal
The dream is to make the compute accessible and machine discoverable, to opportunistically run compute to transform data on the users behalf, imagine tying output of gpt to discoverable 
compute, that it can with enough structured data understand and build computational workflows from. The ultimate goal of which would be generate a funny cow meme, with an audiovisual component. The AI would then generate a workflow job that it could with it's smart contract budget,compute, generate and retrieve the response that stitched together stable diffusion and stable audio to generate a meme that the user could share, without the users explicit intervention. 

Shareable, describable workflows can get you there.

<!-- template just leave alone  -->
## Contributing


## License
Apache License 2.0

<!-- references and additional resources  -->
##  The spec

```

---
*This repo originally forked from [ETCDEVTeam/emerald-explorer](https://github.com/ETCDEVTeam/emerald-explorer).
