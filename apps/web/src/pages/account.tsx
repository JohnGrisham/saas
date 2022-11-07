import * as React from 'react';
import Link from 'next/link';
import { useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useGetUserByEmailQuery } from 'client';

const ROOT = process.env.NEXT_PUBLIC_ROOT_URL as string;

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="p m-auto	my-8 w-full max-w-3xl rounded-md border border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="rounded-b-md border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}

export default function Account() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { data } = useGetUserByEmailQuery(session?.user?.email ?? '');

  const subscription = React.useMemo(() => {
    if (!data?.user?.customer?.subscriptions?.edges?.length) {
      return null;
    }

    return data.user.customer.subscriptions.edges[0]?.node;
  }, [data]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-portal-link', { method: 'POST' });

      if (res.ok) {
        const { url } = await res.json();
        window.location.assign(url);
      } else {
        const error = await res.text();
        throw new Error(error);
      }
    } catch (error) {
      if (error) return console.error((error as Error).message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (!session?.user) {
      window.location.replace(ROOT);
    }
  }, [session]);

  if (!session?.user?.email || !data) {
    return null;
  }

  return (
    <section className="mb-32 bg-black">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription.product.name} plan.`
              : ''
          }
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              <button
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {loading ? (
              <div className="mb-6 h-12">...</div>
            ) : subscription ? (
              `${subscription.product.price}/${subscription.product.interval}/${subscription.product.currency}`
            ) : (
              <Link href="/">
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="mt-8 mb-4 text-xl font-semibold text-white">
            {session.user.name ? (
              `${session.user.name}`
            ) : (
              <div className="mb-6 h-8">...</div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="mt-8 mb-4 text-xl font-semibold text-white">
            {session.user ? session.user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}
