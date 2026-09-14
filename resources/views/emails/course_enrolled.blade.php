<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Enrollment Confirmed - Comestro Academy</title>
    <!--[if mso]>
    <style>
        * { font-family: sans-serif !important; }
    </style>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

        /* Responsive Mobile Styles */
        @media screen and (max-width: 600px) {
            .outer-wrapper {
                padding: 8px 0 !important;
            }
            .email-card {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 0 !important;
                border-left: none !important;
                border-right: none !important;
            }
            .fluid-padding {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
            .header-padding {
                padding: 24px 20px !important;
            }
            .hero-padding {
                padding: 28px 20px 20px 20px !important;
            }
            .card-padding {
                padding: 0 20px 24px 20px !important;
            }
            .cta-padding {
                padding: 0 20px 28px 20px !important;
            }
            .tips-padding {
                padding: 24px 20px !important;
            }
            .footer-padding {
                padding: 24px 20px !important;
            }
            .hero-title {
                font-size: 21px !important;
                line-height: 1.3 !important;
            }
            .course-title {
                font-size: 16px !important;
                line-height: 1.4 !important;
            }
            .cta-table {
                width: 100% !important;
            }
            .cta-button {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
                text-align: center !important;
                padding: 14px 20px !important;
            }
            .course-detail-row {
                display: block !important;
                width: 100% !important;
                padding-bottom: 6px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-wrapper" style="background-color: #f1f5f9; padding: 32px 12px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td class="header-padding" style="padding: 30px 36px; background-color: #0f172a; text-align: left;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <div style="font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                            COMESTRO <span style="color: #818cf8; font-weight: 700; font-size: 13px; background: rgba(99, 102, 241, 0.25); padding: 3px 8px; border-radius: 6px; margin-left: 6px; display: inline-block;">ACADEMY</span>
                                        </div>
                                        <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 400;">
                                            Professional Coding Education & Mentorship
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Hero Banner -->
                    <tr>
                        <td class="hero-padding" style="padding: 36px 36px 22px 36px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="padding: 5px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">
                                        ✓ Enrollment Confirmed
                                    </td>
                                </tr>
                            </table>
                            
                            <h1 class="hero-title" style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                                Welcome aboard, {{ $studentName }}!
                            </h1>
                            
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
                                Congratulations! You are officially enrolled in <strong style="color: #0f172a;">{{ $course->title }}</strong>. Your curriculum modules, video lessons, and interactive classroom are ready for you.
                            </p>
                        </td>
                    </tr>

                    <!-- Course Card -->
                    <tr>
                        <td class="card-padding" style="padding: 0 36px 28px 36px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; box-sizing: border-box;">
                                <tr>
                                    <td style="padding: 20px 22px;">
                                        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6366f1; margin-bottom: 4px;">
                                            {{ $course->category?->name ?? 'Course Program' }}
                                        </div>
                                        <div class="course-title" style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 14px; line-height: 1.4;">
                                            {{ $course->title }}
                                        </div>
                                        
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #64748b; border-collapse: collapse;">
                                            @if($course->instructor?->user?->name)
                                            <tr>
                                                <td class="course-detail-row" style="padding: 5px 0; width: 95px; color: #94a3b8;">Instructor:</td>
                                                <td class="course-detail-row" style="padding: 5px 0; font-weight: 600; color: #1e293b;">{{ $course->instructor->user->name }}</td>
                                            </tr>
                                            @endif
                                            @if($course->duration)
                                            <tr>
                                                <td class="course-detail-row" style="padding: 5px 0; width: 95px; color: #94a3b8;">Duration:</td>
                                                <td class="course-detail-row" style="padding: 5px 0; font-weight: 600; color: #1e293b;">{{ $course->duration }}</td>
                                            </tr>
                                            @endif
                                            <tr>
                                                <td class="course-detail-row" style="padding: 5px 0; width: 95px; color: #94a3b8;">Format:</td>
                                                <td class="course-detail-row" style="padding: 5px 0; font-weight: 600; color: #1e293b; text-transform: capitalize;">{{ $course->type ?? 'Self-Paced' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="course-detail-row" style="padding: 5px 0; width: 95px; color: #94a3b8;">Access:</td>
                                                <td class="course-detail-row" style="padding: 5px 0; font-weight: 600; color: #059669;">Full Lifetime Access</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td align="center" class="cta-padding" style="padding: 0 36px 32px 36px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="cta-table">
                                <tr>
                                    <td align="center" style="border-radius: 10px; background-color: #4f46e5;">
                                        <a href="{{ $classroomUrl }}" target="_blank" class="cta-button" style="display: inline-block; padding: 14px 34px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px; background-color: #4f46e5; border: 1px solid #4f46e5; letter-spacing: -0.2px;">
                                            Go to Classroom →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 12px;">
                                Or access anytime from your <a href="{{ url('/student/courses/enrolled') }}" style="color: #6366f1; text-decoration: underline;">Enrolled Courses</a> dashboard.
                            </div>
                        </td>
                    </tr>

                    <!-- Next Steps Tips -->
                    <tr>
                        <td class="tips-padding" style="padding: 26px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">
                                Quick Tips to Get Started:
                            </div>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #475569; line-height: 1.6;">
                                <tr>
                                    <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #6366f1; font-weight: bold;">•</td>
                                    <td style="padding: 4px 0;"><strong>Start with Module 1:</strong> Watch lectures sequentially and complete each practice challenge.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #6366f1; font-weight: bold;">•</td>
                                    <td style="padding: 4px 0;"><strong>Download Study Notes:</strong> Reference curriculum PDFs and starter code attached to lessons.</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #6366f1; font-weight: bold;">•</td>
                                    <td style="padding: 4px 0;"><strong>Track Progress:</strong> Mark lessons complete as you finish them to unlock certificates.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer-padding" style="padding: 26px 36px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                            <div>Comestro Academy • Online Coding & Engineering Learning</div>
                            <div style="margin-top: 4px;">
                                Need help? Reach out at <a href="mailto:support@comestro.com" style="color: #6366f1; text-decoration: none;">support@comestro.com</a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
