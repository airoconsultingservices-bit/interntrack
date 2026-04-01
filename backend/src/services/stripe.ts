import Stripe from "stripe";
import { config } from "../config/env";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-04-10" as any });

export class StripeService {
  static async createCheckoutSession(tenantId: string, planId: string, successUrl: string, cancelUrl: string) {
    const tenant = await prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });
    let customerId = tenant.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { tenantId } });
      customerId = customer.id;
      await prisma.tenant.update({ where: { id: tenantId }, data: { stripeCustomerId: customerId } });
    }
    const priceId = planId === "pro" ? config.stripe.prices.pro : config.stripe.prices.enterprise;
    return stripe.checkout.sessions.create({
      customer: customerId, mode: "subscription",
      payment_method_types: ["card", "link"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl, cancel_url: cancelUrl,
      subscription_data: { metadata: { tenantId, plan: planId } },
    });
  }

  static async handleWebhook(body: Buffer, signature: string) {
    const event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
    logger.info("Stripe webhook: " + event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const tenantId = sub.metadata.tenantId;
      const plan = sub.metadata.plan === "enterprise" ? "ENTERPRISE" : "PRO";
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { plan: plan as any, stripeSubscriptionId: sub.id, maxUsers: plan === "ENTERPRISE" ? 500 : 50, maxAppsPerMonth: plan === "ENTERPRISE" ? 10000 : 1000 },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const tenantId = sub.metadata.tenantId;
      await prisma.tenant.update({ where: { id: tenantId }, data: { plan: "FREE", stripeSubscriptionId: null, maxUsers: 50, maxAppsPerMonth: 100 } });
    }

    return { received: true };
  }
}
