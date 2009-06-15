(function()
{
	if (App.mq)
	{
		App.Wel.StateMachine = {};

		// track active state machines
		App.Wel.StateMachine.active = [];

		App.StateMachine = function(name)
		{
			// record state machine
			App.Wel.StateMachine.active.push(this);

			// name of state machine
			this.name = name;

			// states
			this.states = [];

			// state change listeners
			this.listeners = [];

			// active state
			this.activeState = null;

			// add a state
			this.addState = function(state,trigger,active)
			{
				// create listener
				var self = this

				// parse trigger data
				// takes for of message[name=value,name2!=value]
				var actionParams = App.Wel.parameterRE.exec(trigger);
				var type = (actionParams ? actionParams[1] : trigger);
				var params = actionParams ? actionParams[2] : null;
				var actionParams = params ? App.Wel.getParameters(params,false) : null;

				// setup listener
				$MQL(type, function(msg)
				{
					var ok = App.Wel.parseConditionCondition(actionParams, msg.payload);
					if (ok == true)
					{
						self.fireStateChange(state);
					}
				});

        // store state objects for each state machine
        var stateObj = {active:false,name:state};
        this.states.push(stateObj);

        // only one active state
        if (active ==true)
        {
            this.fireStateChange(state);
        }
      };

			// helper method to get current active state
			this.getActiveState = function()
			{
				return this.activeState;
			};

			// helper method to programatically set the active state
			this.setActiveState = function(state)
			{
				this.fireStateChange(state);
			}

			// add a state change listener
			this.addListener = function(callback)
			{
				this.listeners.push(callback);
			};

			// fire a state change
			this.fireStateChange = function(state)
			{
				// set states
				for (var i=0;i<this.states.length;i++)
				{
					if (this.states[i].name == state)
					{
						this.states[i].active = true;
						this.activeState = state;
					}
					else
					{
						this.states[i].active = false;
					}
				}
				// call listeners
				for (var i=0;i<this.listeners.length;i++)
				{
					this.listeners[i].call(this)
				}

			}
		}		
	}

	
})()
