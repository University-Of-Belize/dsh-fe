<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import type { ServerMessage, UserDetailsMessage, Message } from '$lib/types/Message';
	import MessageStrip from '$lib/Elements/Dashboard/MessageStrip.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';

	import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	// What is what, anyway?
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';

	let messageBox: HTMLInputElement;
	let messageBlock: HTMLDivElement;

	let selected_user: TextInput;
	let selected_subject: TextInput;

	let current_interaction: UserDetailsMessage;
	let interactions: ServerMessage[]; // Declare the data variable
	$: interactions; // List of interactions (ServerMessage[])
	const slug = $page.params.user_id;

	let debounceTimeout: number;
	let error_string: string = '';
	let bad_error: boolean = false;
	let error_message: HTMLDivElement;

	async function catchAll() {
		const res = (await fetchWebApi(
			'v1/user/messaging/get',
			'POST',
			what_is(what.public.user, slug)
		)) as Response;
		if (!res.ok) {
			const r = await res.json();
			bad_error = true;
			return toast.push(r.message);
		}
		const r = await res.json();
		interactions = r.is; // Rizz
		current_interaction = JSON.parse(localStorage.current_interaction);
		// console.log(data);
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault();

		// Send the message
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			// @ts-ignore
			const valueArray = Array.from(event.target)
				.filter((el) => el.name)
				.map((el) => el.value);

			const message: Message = {
				user: selected_user?.value ?? current_interaction?.username,
				message: {
					subject: selected_subject?.value ?? '',
					content: valueArray[0]
				}
			};

			sendMessage(message);
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	};

	async function sendMessage(message: Message) {
		// Reset error message
		error_message.innerText = '';
		bad_error = false;

		// Send the message
		const res = (await fetchWebApi(
			'v1/user/messaging/send',
			'POST',
			what_is(what.public.user, message)
		)) as Response;
		if (!res.ok) {
			const r = await res.json();
			error_message.innerText = r.message;
			bad_error = true;
			return toast.push(r.message);
		}
		// Current message
		const r = await res.json();
		messageBox.value = '';

		bad_error = false;
		error_string = 'Your message has been sent.';

		// Push the new interaction
		interactions.push(r.is); // Rizz up the message
		interactions = interactions; // Trigger the reactivity
		// console.log(interactions);

		// Scroll to bottom of the messageBlock
		messageBlock.scrollTo(0, messageBlock.scrollHeight);
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<div class="content block h-full w-full overflow-auto bg-transparent px-3 py-6 lg:px-16 lg:py-16">
	<div class="flex space-x-2 pb-2 text-2xl font-semibold">
		<div class="inline">
			{#if current_interaction}
				<span>Your interaction with</span> <code>@{current_interaction?.username}</code>
			{:else}
				<span>New conversation</span>
			{/if}
		</div>
	</div>

	<div class="flex w-full flex-wrap justify-between pb-12 text-sm font-light">
		<div>
			{@html interactions
				? 'Interact '
				: "Start your new interaction. You will need to know the user's @TAG to converse with them.<br/>Use the username 'staff' for contacting the staff about an item."}
			{interactions ? `with ${slug}. Sent messages will be displayed below.` : ''}
		</div>
	</div>
	<div class="flex h-3/4 w-full flex-col flex-wrap lg:h-full">
		<!-- The first message sets the chat's subject -->
		<div class="mb-4 flex w-full justify-start space-x-2 pb-2 text-xl font-light">
			{#if interactions}
				<span>Subject:</span><b>{interactions[0]?.subject}</b>
			{:else}
				<div class="messagebox mt-auto block w-full lg:mb-6 lg:w-auto">
					<div class="block w-full space-y-4">
						<TextInput
							bind:this={selected_user}
							icon={faUser}
							name="user_id"
							type="text"
							placeholder="Enter a username"
							custom_style="bg-transparent"
							required
						/>
						<TextInput
							bind:this={selected_subject}
							icon={faUser}
							name="subject"
							type="text"
							placeholder="Enter a subject"
							custom_style="bg-transparent"
							required
						/>
						<form action="#" on:submit={(event) => handleSubmit(event)}>
							<div class="relative flex h-fit w-full overflow-clip rounded-lg bg-COLORBLK1 p-1.5">
								<input
									bind:this={messageBox}
									type="text"
									name="message"
									autocomplete="off"
									title="Send a new message"
									class="block w-full border-0 bg-transparent text-xs font-light text-COLORWHT placeholder-COLORWHT focus:border-0 focus:ring-0 sm:text-sm"
									placeholder="Leave a message"
								/>
								<button
									type="submit"
									class="flex h-full cursor-pointer items-center justify-center px-6 py-2 text-center hover:bg-COLORBLK2"
								>
									<Fa icon={faPaperPlane} class="text-gray-500" />
								</button>
							</div>
						</form>
					</div>
					<span class="stub hidden text-emerald-600 text-rose-600"></span>
					<p
						bind:this={error_message}
						class="mt-2 text-xs {bad_error ? 'text-rose-600' : 'text-emerald-600'}"
					>
						{@html error_string ?? '&nbsp;'}
					</p>
				</div>
			{/if}
		</div>
		{#if interactions}
			<div bind:this={messageBlock} class="messages block" style="max-height: 80%; overflow: auto;">
				{#each interactions as interaction}
					<MessageStrip
						id={interaction._id}
						icon={interaction.from_user.profile_picture ?? config['user']['default-image']}
						username={interaction.from_user.username}
						message={interaction.content ?? '<i>No content</i>'}
						status="unused"
					/>
				{/each}
				<MessageStrip hidden={true} />
			</div>
		{/if}
		{#if current_interaction}
			<div class="messagebox mt-auto block lg:mb-6">
				<form
					class="relative flex h-fit w-full overflow-clip rounded-lg bg-COLORBLK1 p-1.5"
					action="#"
					on:submit={(event) => handleSubmit(event)}
				>
					<input
						bind:this={messageBox}
						type="text"
						name="message"
						autocomplete="off"
						title="Send a message to @{current_interaction?.username}"
						class="block w-full border-0 bg-transparent text-xs font-light text-COLORWHT placeholder-COLORWHT focus:border-0 focus:ring-0 sm:text-sm"
						placeholder="Send a message to @{current_interaction?.username}"
					/>
					<button
						type="submit"
						class="flex h-full cursor-pointer items-center justify-center px-6 py-2 text-center hover:bg-COLORBLK2"
					>
						<Fa icon={faPaperPlane} class="text-gray-500" />
					</button>
				</form>
				<p bind:this={error_message} class="mt-2 text-xs text-rose-600">
					{error_string ?? ''}
				</p>
			</div>
		{/if}
	</div>
</div>
