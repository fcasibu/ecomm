import { getServerContext } from '@/lib/utils/server-context';
import { clerkClient } from '@clerk/nextjs/server';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { cartController, customersController } from '@ecomm/services/registry';
import type { PostLoginInput } from '@ecomm/validations/web/customer/post-login-schema';

const client = clerkClient();

export async function runPostLogin(id: string) {
  try {
    const userApi = (await client).users;

    const user = await userApi.getUser(id);

    if (user.privateMetadata.onboardingCompleted) {
      return {
        success: false,
        message: 'User already onboarded',
      };
    }

    const input = {
      authUserId: user.id,
      emailAddress:
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        '',
    } as const satisfies PostLoginInput;

    const serverContext = await getServerContext();

    const customerResult = await executeOperation(() =>
      customersController().postLogin(serverContext, input),
    );

    if (!customerResult.success) {
      return {
        success: false,
        message: customerResult.error.message,
      };
    }

    userApi.updateUserMetadata(user.id, {
      privateMetadata: {
        onboardingCompleted: true,
      },
    });

    const cartResult = await executeOperation(() =>
      cartController().postLogin(serverContext),
    );

    if (!cartResult.success) {
      return {
        success: false,
        message: cartResult.error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
