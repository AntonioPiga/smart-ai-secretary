<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

	var token;

	const authorizationUrl = generateAuthorizationUrl();
	console.log('Authorization URL:', authorizationUrl);
	async function callback() {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code) {
			token = getToken(code);
			console.log('token');
			console.log(token);
		} else {
			console.error('Error: code not exist');
		}
	}

	function generateAuthorizationUrl() {
		const clientId = '';
		const redirectUri = 'http://127.0.0.1:5173/calendar';
		const scope = 'https://www.googleapis.com/auth/calendar';
		const responseType = 'code';

		const authorizationUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

		return authorizationUrl;
	}

	async function getToken(code: string) {
		//call nuv

		return 'accessToken';
	}

	async function getEvents(token: string) {}

	onMount(async () => {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code) {
			console.log('eccoci');
			callback();
		} else {
			console.log('non ci siamo');
		}
		// if (token.length === 0) {
		// 	//generateAuthorizationUrl();
		// } else if (1 + 2 === 3) {
		// 	getEvents('token');
		// }
	});
</script>

<p>Ciao!</p>
