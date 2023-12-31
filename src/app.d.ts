// See https://kit.svelte.dev/docs/types#app

import type { Circle } from "@circle-fin/circle-sdk";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			circle: Circle;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				GITHUB_ID: string;
				GITHUB_SECRET: string;
				AUTH_SECRET: string;

				CIRCLE_API_KEY: string;
				CIRCLE_WALLET_SET: string;
				CIRCLE_WALLET_SET_CREATION_CIPHERTEXT: string;
				CIRCLE_ENTITY_SECRET_HEX: string;

				DATABASE: D1Database;
			}
		}
	}
}

export {};
