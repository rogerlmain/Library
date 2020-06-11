<div id="login_form" class="one-column-form">

	<label for="username">Email</label>
	<input type="text" id="username" name="username" />
	
	<label for="password">Password</label>
	<div class="password-cell">
		<input type="password" id="password" name="password" />
		<img src="Images/eyeball.on.svg" class="password-eyeball" onclick="toggle_password ($(this).parent ());" />
	</div>
	
	<div class="full-column-span right-aligned">
		<button onclick="return submit_form ($('#login_form'));">Login</button>
	</div>
	
</div>