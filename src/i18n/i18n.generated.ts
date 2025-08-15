export type I18nTranslations = {
  errors: {
    appointment: {
      not_found: string;
      date_required: string;
      date_invalid: string;
      start_time_required: string;
      start_time_invalid: string;
      end_time_required: string;
      end_time_invalid: string;
      duration_required: string;
      duration_invalid: string;
      price_required: string;
      price_invalid: string;
      company_required: string;
      company_invalid: string;
      employee_required: string;
      employee_invalid: string;
      customer_required: string;
      customer_invalid: string;
      service_required: string;
      service_invalid: string;
    };
    customer: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      email_required: string;
      email_invalid: string;
      document_required: string;
      document_invalid: string;
      phone_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    role: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      description_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    notification: {
      not_found: string;
      type_required: string;
      type_invalid: string;
      title_required: string;
      title_invalid: string;
      message_required: string;
      message_invalid: string;
      recipient_required: string;
      recipient_invalid: string;
    };
    company: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      document_required: string;
      document_invalid: string;
      email_required: string;
      email_invalid: string;
      phone_invalid: string;
      address_invalid: string;
    };
    user: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      email_required: string;
      email_invalid: string;
      password_required: string;
      password_invalid: string;
      document_invalid: string;
      phone_invalid: string;
      role_required: string;
      role_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    employee: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      email_required: string;
      email_invalid: string;
      document_required: string;
      document_invalid: string;
      phone_invalid: string;
      commission_rate_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    service: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      description_invalid: string;
      duration_required: string;
      duration_invalid: string;
      price_required: string;
      price_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    profile: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      description_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    color: {
      not_found: string;
      name_required: string;
      name_invalid: string;
      hex_required: string;
      hex_invalid: string;
      company_required: string;
      company_invalid: string;
    };
    auth: {
      invalid_credentials: string;
      no_active_company: string;
      company_access_denied: string;
      switch_company_failed: string;
      unauthorized: string;
      token_expired: string;
      token_invalid: string;
      current_password_required: string;
      current_password_invalid: string;
      new_password_required: string;
      new_password_invalid: string;
      passwords_match: string;
      email_not_verified_for_reset: string;
      password_reset: {
        invalid_token: string;
        expired_token: string;
      };
    };
  };
  messages: {
    appointment: {
      created: string;
      updated: string;
      deleted: string;
      cancelled: string;
    };
    customer: {
      created: string;
      updated: string;
      deleted: string;
    };
    role: {
      created: string;
      updated: string;
      deleted: string;
    };
    notification: {
      created: string;
      updated: string;
      deleted: string;
      read: string;
      all_read: string;
    };
    company: {
      created: string;
      updated: string;
      deleted: string;
    };
    user: {
      created: string;
      updated: string;
      deleted: string;
      password_changed: string;
    };
    employee: {
      created: string;
      updated: string;
      deleted: string;
    };
    service: {
      created: string;
      updated: string;
      deleted: string;
    };
    profile: {
      created: string;
      updated: string;
      deleted: string;
    };
    color: {
      created: string;
      updated: string;
      deleted: string;
    };
    auth: {
      login_success: string;
      logout_success: string;
      password_changed: string;
      token_refreshed: string;
    };
  };
  auth: {
    request_password_reset_success: string;
    reset_password_success: string;
    change_password_success: string;
  };
};
