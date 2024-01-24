<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import {
		PUBLIC_URL_GET_CALENDAR_TOKEN,
		PUBLIC_URL_CALENDAR_ID,
		PUBLIC_URL_AI_DESCRIBE_EVENTS
	} from '$env/static/public';

	var token = '';
	var eventsDescription: string;
	var authorizationUrl: string;
	var displayedMessage: string;

	/**
	 * Functions util to show text with real effect
	 */

	async function showMessage() {
		for (let i = 0; i < eventsDescription.length; i++) {
			displayedMessage = eventsDescription.substring(0, i + 1);
			await sleep(30);
		}
	}

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	/**
	 *
	 */

	/**
	 * Google callback after that give consents
	 */
	async function callback() {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code && token.length == 0) {
			try {
				token = await getToken(code);
				window.history.replaceState({}, document.title, window.location.pathname);
				var events = await getEvents(token);
				await descriptionEvents(events);
				await showMessage();
			} catch (error) {
				console.error('Error during token and events call:', error);
			}
		} else {
			console.error('Error: code does not exist');
		}
	}

	async function getEventsAndDescibeThemAgain() {
		try {
			eventsDescription = '';
			var events = await getEvents(token);
			await descriptionEvents(events);
			await showMessage();
		} catch (error) {
			console.error('Error during token and events call:', error);
		}
	}

	async function descriptionEvents(events: any) {
		const apiUrl = PUBLIC_URL_AI_DESCRIBE_EVENTS;

		const params = {
			input: events
		};

		try {
			const response = await axios.post(apiUrl, params);
			console.log('Response is:', response.data);
			console.log('Response is:', response.data.token);
			eventsDescription = response.data.output;
			return response.data.output;
		} catch (error) {
			console.error('Error during token call:', error);
			throw error;
		}
	}

	function generateAuthorizationUrl() {
		const clientId = PUBLIC_URL_CALENDAR_ID;
		const redirectUri = 'http://127.0.0.1:5173/calendar';
		const scope = 'https://www.googleapis.com/auth/calendar';
		const responseType = 'code';

		authorizationUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;

		return authorizationUrl;
	}

	async function getToken(code: string) {
		const apiUrl = PUBLIC_URL_GET_CALENDAR_TOKEN;

		const params = {
			code: code
		};

		try {
			const response = await axios.post(apiUrl, params);
			console.log('Response is:', response.data);
			console.log('Response is:', response.data.token);
			return response.data.token;
		} catch (error) {
			console.error('Error during token call:', error);
			throw error;
		}
	}

	async function getEvents(token: string) {
		console.log('get events');
		const apiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

		const headers = {
			Authorization: 'Bearer ' + token
		};

		const currentDate = new Date();
		currentDate.setHours(0, 0, 0);
		const formattedStartDate = currentDate.toISOString().split('.')[0] + 'Z';

		currentDate.setHours(23, 59, 59);
		const formattedEndDate = currentDate.toISOString().split('.')[0] + 'Z';

		const params = {
			timeMin: formattedStartDate,
			timeMax: formattedEndDate
		};

		try {
			const response = await axios.get(apiUrl, { headers, params });

			const items: Array<{
				start: string;
				end: string;
				organizer: string;
				summary: string;
			}> = response.data.items.map((item: any) => {
				return {
					start: item.start.dateTime,
					end: item.end.dateTime,
					organizer: item.organizer.email,
					summary: item.summary
				};
			});
			return items;
		} catch (error) {
			console.error('Errore durante la chiamata agli eventi:', error);
			throw error;
		}
	}

	onMount(async () => {
		const queryParams = new URLSearchParams(window.location.search);
		const code = queryParams.get('code');

		if (code && token.length == 0) {
			console.log('callback calling');
			await callback();
		} else {
			console.log('auth url');
			generateAuthorizationUrl();
		}
	});
</script>

<div class="flex justify-center items-center mt-10">
	{#if authorizationUrl}
		<button class="rounded bg-light px-3 py-1.5 text-l font-medium text-white hover:bg-primary">
			<a href={authorizationUrl}>Click here to see your events</a>
		</button>
	{:else}
		<div class="h-60 border border-primary rounded bg-slate-200 shadow-md p-2 w-4/6 relative">
			{#if eventsDescription}
				{displayedMessage}

				<div class="absolute bottom-0 right-0 flex items-center bg-white">
					<button
						type="button"
						class="rounded bg-light px-3 py-1.5 text-l font-medium text-white hover:bg-primary"
						on:click={() => getEventsAndDescibeThemAgain()}
					>
						Try again
					</button>
				</div>
			{:else}
				<div class="flex justify-center items-center h-30 p-10">
					<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
				</div>
			{/if}
		</div>
	{/if}
</div>
