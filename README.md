# AB-tests-service

A Microservice for incorporating `A/B/n testing` or `Split testing` or `Multivariate testing (MVT)` into any application.

This app can be hosted as a microservice and then called from the backend or frontend of any app via REST API. 

`Stack: NodeJs & MySql`


___

## Terms and Entities:

* `Experiment` - Represents a single test. The service supports running multiple experiments at the same time.
* `Variant` - One of the versions that is tested during an experiment - assigned to a `Test Object`. (ie. A/B/control/etc).
* `Test Object` - Any entity that needs to be tracked during an experiment (user/session/mouse/ect). An entity is comprised of a `type` (to support multiple types), and an `entity id` (ie. session & session_id or user & user_id).
* `Events` - Events in the system that runs the experiments, that are triggered by the `Test Object` and need to be tracked for data analasys after the experiment.


___
# Set Up:

1. clone the repo
2. run `npm install`
3. set up the database by running the sqls in `/database/setup.sql`
4. copy `.env.example` into `.env` and add your values
5. run the service and try the `GET /api/ping` endpoint

___
# Usage Guide:

## Adding a new Experiment:

> See an example file with sql seeder at `/database/new_experiment_example_seeder.sql`

First, add a new experiment: give it a unique `name` that can be used as a key in the code, 
and define the run start and end time, the experiment will run only if it's set to `is_active=1`

```sql
INSERT INTO `experiments` (`id`, `name`, `desc`, `is_active`, `start_at`, `end_at`) VALUES (1, 'register_btn_color', 'checking which register btn colors gets more clicks', 1, 1630508887, 1638513687);
```

Next, define the variations for this experiment. 
An experiment can have multiple variants, give each variant a unique `name` that can be used in the code, and split between all the variants the `allocation` of traffic to each of them, together they should add up to 100%.
notice that one of the variants should serve as a `control` (default), and needs to be set on `experiment.default_variant_name`. This is the variant that will be used when the experiment is not running (aka the winning variant).

```sql
INSERT INTO `variants` (`experiment_id`, `name`, `allocation`) VALUES 
(1, 'control', 50),
(1, 'green', 50);

```

Next up, it's time to set up data that can be analyzed after the experiment is over to decide which variant was better.

Start by thinking of the goals of this experiment and the related events, such as:
- more signups (submit signup form event)
- more purchases (payment submitted, item added to cart, etc)
- daily/weekly retantion (login)
- less help requests on some page
- and anything else that is relevant to your app
 
Your goal can be simple, for example, get more signups, but it's important to understand, that 200 signups can come from the same user spamming your system. This is why tracking the right data is very critical to getting worthy results. So instead of setting up goals, we set up `events` that will give your data analysts more material to work with.

Note: same events can be used in multiple experiments, so only add what you need for the new experiments that doesn't exist yet.

```sql
INSERT INTO `events` (`id`, `name`) VALUES 
(1, 'register_btn_clicked'),
(2, 'login'),
(3, 'item_added_to_shopping_cart'),
(4, 'purchase_submitted'),
(5, 'contact_us_submitted'),
```

Lastly, bind the experiment to any event(s) that needs to be tracked for it

```sql
INSERT INTO `experiments_events` (`experiment_id`, `event_id`) VALUES (1, 1);
```

## Variants implementation

Now that we've set up our experiment configuration, and defind that it'll have 2 variants, it's time to implement those in the code.

The AB-Tests microservice provides an API to interact with the configuration that we've just defined in the DB.

It exposes 4 endpoints:
1. GET `/api/experiment/active`
2. GET `/api/variant/:experimentName/:testedEntityType/:testedEntityId`
3. POST `/api/event`
4. GET `/api/` or `/api/ping`

**Here is a suggested flow on how to use them:**

Get a list of all active experiments using `GET /api/experiment/active`

Find the place in your code where a decision should be made on which variant to use for a specific experiment, check based the results in previous step if this experiment is still active. if it's not, it's up to you what the code should do in such case, you'd probably want to show the default/winning variant set up for the experiment.

If the experiment is active, call `GET /api/variant/:experimentName/:testedEntityType/:testedEntityId`
You'll get back a variant to use for the given entity (behind the scenes ab-test-service will allocate one of the variants in this expetiment to this entity and create a Test Object in the DB). 
> Since after the allocation, the variant will not change for this entity it's advised to cache the result somewhere on the backend (redis) or frontend (cookie) with relevant TTL (clear cache when experiment is no longer active) and try getting variant from there before calling the `/api/variant` endpoint. 


Now that you have the variant, use it to control which code parts will execute. 
`if variant == 'a' show versionA else show versionB`

If a new event was created during the DB setup, add a trigger to `POST /api/event` call where the event is triggered in the code.
You'll need to pass the entity that triggered the event, the event that was triggered, and optionaly anything else that might be relevant to analyze later. 


That's it, the experiment is ready to run!


## Analyzing Experiment Results

After the experiment is over it's time to analyze results and see which variant did better (if any), and decide what to do next, keep one of the variants? keep both variants? maybe one did better for young users and the other for older users? maybe set up a new experiment and variants.
This can be controlled in DB, by changing the experiments' default variant, extending run duration, changing allocations, etc, or directly in the code, by deleting/changing it as needed.

the data to analyze is saved in tables 
`test_objects` and 
`test_objects_events` - list of all the events that the test object triggered during the experiment run


___
# Code Example (VueJs):

Here is a very basic example of how we can run an experiment called `register_btn_color`, and test which button color gets more clicks.
The experiment has 2 variants, 1st is `green` and the other can be set up as `blue` or `control` and would serve as the default for this experiment.

So we get a variant assigment for our current session user, and show the coresponding variant html component.

And we bind the event `register_btn_clicked` to the btn on-click.


```js
<template>
  <div>
    <button v-if="variant === 'green'" v-on:click="btnClicked()">Green Btn</button>
    <button v-else-if="variant !=== null" v-on:click="btnClicked()">Blue Btn</button>
  </div>
</template>

export default {
  name: 'MyApp',
  data() {
    return {
      variant: null,
    };
  },
  methods: {
    runExperiment(experimentName) {
      // todo get variant by experimentName from cookie,.. if cookie doesnt exist...
      axios.get(`http://abtest-service/api/variant/${experimentName}/session/${sessionId}`)
      .then((res) => {
        this.variant = res.variant ? res.variant : 'control'
        // todo save into cookie (experimentName, variant)
      })
    },
    btnClicked(message) {
      axios.post('http://abtest-service/api/event', {
        eventName: 'register_btn_clicked', 
        testedEntityType: 'session', 
        testedEntityId: sessionId, 
        eventData: {}
      })
    }
  },  
  created() {
    // todo if 'register_btn_color' is active..
    this.runExperiment('register_btn_color')
  }
```

____
> If you found this helpful in any way, please leave a star

> If you have questions/suggestions/fixes, I'd be happy to hear from you!