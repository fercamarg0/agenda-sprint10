import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Public } from "../../shared/decorator/public.decorator";
import { SubscriptionsService } from "./subscriptions.service";
import { RequestWithUser } from "../../shared/interfaces/request-with-user.interface";
import { VerifySubscriptionDto } from "./dto/verify-subscription.dto";
import { SubscriptionProvider } from "@prisma/client";
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  @Get("plans")
  @Public()
  getPlans() {
    return this.subscriptionsService.getAvailablePlans();
  }
  @Get("status")
  @UseGuards(AuthGuard("jwt"))
  getSubscriptionStatus(@Req() req: RequestWithUser) {
    return this.subscriptionsService.getSubscriptionStatus(req.user.businessId);
  }
  @Post("verify")
  @UseGuards(AuthGuard("jwt"))
  verifyAndCreateSubscription(@Body() verifyDto: VerifySubscriptionDto) {
    return this.subscriptionsService.verifyAndCreateSubscription(verifyDto);
  }
  @Post("webhook/stripe")
  @Public()
  handleStripeWebhook(@Req() req: any) {
    const event = req.body;
    return this.subscriptionsService.handleSubscriptionEvent(
      SubscriptionProvider.STRIPE,
      event,
    );
  }
  @Post("webhook/apple")
  @Public()
  handleAppleWebhook(@Body() payload: any) {
    return this.subscriptionsService.handleSubscriptionEvent(
      SubscriptionProvider.APPLE,
      payload,
    );
  }
  @Post("webhook/google")
  @Public()
  handleGoogleWebhook(@Body() payload: any) {
    return this.subscriptionsService.handleSubscriptionEvent(
      SubscriptionProvider.GOOGLE,
      payload,
    );
  }
}
