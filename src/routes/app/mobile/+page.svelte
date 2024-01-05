<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CardBlock from '$lib/Elements/Generic/Cards/CardBlock.svelte';
	import CardPicker from '$lib/Elements/Generic/Cards/CardPicker.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/Search/SearchBar.svelte';
	const eula = ($page.url.searchParams.get('eula') as string) == 'true';

	import { faCheckDouble, faCheck } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	onMount(() => {
		document.title = 'Plattr | Mobile App / Beta Testers Agreement';

		if (eula) {
			localStorage.setItem('eula', 'true');
			toast.push(
				'Thank you! You have accepted the terms and conditions. Redirecting you to the app install screen.'
			);
			setTimeout(() => {
				goto('/auth/verify?jo=shwanesgae');
			}, 2000);
		}
	});
</script>

<main class="h-screen w-full overflow-hidden text-COLORWHT">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div
		class="content-wrapper absolute z-10 flex h-full w-full items-start justify-start overflow-auto pb-40"
	>
		<div class="content flex flex-1 items-center justify-center">
			<div class="block p-8 text-left">
				<div class="title pb-5 text-2xl font-semibold">Install for mobile</div>
				<CardPicker
					title="Mobile 📱"
					subtitle="Select this option if you're using a mobile device"
					body="Please take a moment to carefully read and review the installation agreement. Your understanding and acceptance of the terms outlined in the agreement are essential before proceeding with the installation. Thank you for choosing our mobile app—we appreciate your commitment to a smooth and secure experience."
					image="/pwa/screenshots/mobile_1.jpg"
					image_alt="Plattr Mobile App"
					button_icon={faCheck}
					button_color="COLORGRN2"
					button_text="Read the terms and conditions"
					where_to="/app/mobile#terms"
				/>
				<div class="stub block hidden" />
				<CardBlock
					title="<div id='terms'>Beta Testers Terms</div>"
					subtitle="Please carefully review and acknowledge the terms outlined in the Beta Testers Terms before proceeding.<br/>This is required in order to keep your experience safe and smooth as possible"
					body="Please carefully review and acknowledge the terms outlined in the Beta Testers Agreement before proceeding."
					body_optional={`
						<div class="block text-COLORWHT">
						Are you interested in testing our brand-new cafeteria ordering system?
						<br />If so, we are excited to have you as an early tester.<br /><br />
						Your participation in our beta testing program is vital to refining and
						improving our product.<br />
						By accepting these terms, you contribute to the development process and help
						us deliver a better experience to all users.<br />
						Thank you in advance for your commitment to innovation and quality.<br /><br />

						<div class="text-2xl font-semibold mb-9">Beta Testers Agreement</div>
						<div class="eula-body block">
							<div>
								This is the form to sign up for Alpha Testing for the UB Cafeteria
								Ordering System. This IS NOT THE <u><b>FINAL</b></u> ORDERING
								SYSTEM.<br />
								The <b>ACTUAL</b> system is still underway and testers are needed.
								<div>
									<div>
									We are conducting this <b>'Online Test #1'</b> to ensure all our
									basic systems are working before releasing it to the public while
									establishing a<br />
									feedback loop where testers can influence the development of the
									software by...
									<div>
										<ol class="ol p-9">
											<li class="li">Providing requests (feedback suggestions)</li>
											<li class="li">Providing reports (crashes, freezes, glitches)</li>
											<li class="li">
												Stress testing the system (deliberately attempting to
												break the system, deliberately hacking the system)
											</li>
											<li class="li">
												Providing general feedback (suggesting improvements,
												corrections, or pointing out errors)
											</li>
										</ol>
									</div>
									</div>

									<div class="text-xl font-semibold my-6">Disclaimer</div>
									<div>
									By participating in this testing program, you agree to provide
									continuous feedback and report any issues you encounter.
									</div>
									<div class="text-xl font-semibold my-6">The Agreement</div>
									<div>
									<div>
										Alpha Testing for UB Cafeteria Web-Based Ordering System
									</div>
									<div>
										By participating in the Alpha Testing for the UB Cafeteria
										Web-Based Ordering System, you acknowledge that the
										information<br />
										entered and any features encountered during testing are
										intended to remain confidential.
									</div>
									<br />
									<div>
										This software is intended solely for the use of the receiving
										participant(s) signing up via this form. Be advised that any
										external review, use, disclosure,<br />
										dissemination, copying, retention, or alteration of the
										application is strictly prohibited unless explicitly allowed
										by the developer.
									</div>
									<br />
									<div>
										And again, your understanding and commitment to maintaining
										the confidentiality of this testing process are highly
										appreciated.
									</div>
									</div>
								</div>
								<div class="text-2xl font-semibold my-9">
									Questions? Comments? Contact Us
								</div>
								<div>
									For any questions or concerns, please contact us at
									<u><a href="mailto:cafeteria@ub.edu.bz">cafeteria@ub.edu.bz</a></u>
								</div>
							</div>
						</div>
						</div>
					
					`}
					button_icon={faCheckDouble}
					button_color="COLORBLE"
					button_text="I have read and agree to the terms provided here"
					button_reloads={true}
					where_to="/app/mobile?eula=true"
				/>
			</div>
		</div>
	</div>
</main>
<div class="footer relative z-10">
	<Footer text="Looks like you've reached the end.">
		<div class="block">
			<!-- <div class="text-xl font-light">Shop our entire menu by creating an account</div> -->
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				<SearchBar />
			</div>
		</div>
	</Footer>
</div>

<style>
	:global(.ol) {
		list-style: none;
		counter-reset: my-counter;
	}

	:global(.li) {
		counter-increment: my-counter;
		margin-bottom: 10px; /* Adjust as needed */
	}

	:global(.li:before) {
		content: counter(my-counter) '. ';
		font-weight: bold; /* Optional: make the numbers bold */
		color: #007bff; /* Optional: change the color of the numbers */
		margin-right: 5px; /* Optional: adjust the spacing between number and text */
	}
	/* Hide scrollbar for Chrome, Safari and Opera */
	:global(body)::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	:global(body) {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: 0; /* Firefox */
	}
</style>
