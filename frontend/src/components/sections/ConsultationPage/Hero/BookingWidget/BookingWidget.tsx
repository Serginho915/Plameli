"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation.ts";
import { translations } from "../ConsultationHero.translations.ts";
import styles from "./BookingWidget.module.scss";
import { CheckIcon } from "@/components/ui/Icons/CheckIcon/CheckIcon.tsx";
import { Button } from "@/components/ui/Button/Button.tsx";
import { CalendarIcon } from "@/components/ui/Icons/CalendarIcon/CalendarIcon.tsx";
import { UrgentIcon } from "@/components/ui/Icons/UrgentIcon/UrgentIcon.tsx";

export const BookingWidget = () => {
  const { t, language } = useTranslation(translations);
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [selectedFormat, setSelectedFormat] = useState<"standard" | "priority">("standard");
  const [meetingType, setMeetingType] = useState<"sofia" | "zoom">("sofia");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>("15:00");
  const [viewDate, setViewDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
  const contentRef = useRef<HTMLDivElement | null>(null);

  const stepsCount = 4;
  const dotStep = 18; // 10px dot + 8px gap
  const startX = prevStep * dotStep;
  const targetX = currentStep * dotStep;
  const distance = Math.abs(targetX - startX);

  const [showErrors, setShowErrors] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Track content height via ResizeObserver for smooth, accurate sizing
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const height = el.scrollHeight;
      setContentHeight(height > 0 ? height : "auto");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevStep(currentStep);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Bugfix: Clear selected date if it becomes invalid when switching formats
  useEffect(() => {
    if (selectedDate && selectedFormat === "standard") {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 14);
      minDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < minDate) {
        setSelectedDate(null);
        setSelectedTime(null);
      }
    }
  }, [selectedFormat, selectedDate]);

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return !!selectedFormat && !!meetingType;
      case 1:
        return !!formData.name && formData.phone.length >= 8 && !!formData.email && formData.email.includes("@");
      case 2:
        return !!selectedDate && !!selectedTime;
      default:
        return true;
    }
  };

  const getFieldError = (field: string) => {
    if (!showErrors) return "";
    const v = t.bookingWidget.validation;
    
    switch (field) {
      case "format":
        return !selectedFormat ? v.format : "";
      case "meetingType":
        return !meetingType ? v.meetingType : "";
      case "name":
        return !formData.name ? v.name : "";
      case "phone":
        if (!formData.phone) return v.phone;
        if (formData.phone.length < 8) return v.phoneShort;
        return "";
      case "email":
        if (!formData.email) return v.email;
        if (!formData.email.includes("@")) return v.emailInvalid;
        return "";
      case "date":
        return !selectedDate ? v.date : "";
      case "time":
        return !selectedTime ? v.time : "";
      default:
        return "";
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setDirection(-1);
      setCurrentStep(step);
      setShowErrors(false);
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      if (currentStep < stepsCount - 1) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
        setShowErrors(false);
      }
    } else {
      setShowErrors(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const generateDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Define min date based on format
    const minDate = new Date();
    if (selectedFormat === "standard") {
      minDate.setDate(minDate.getDate() + 14);
    } else {
      minDate.setDate(minDate.getDate() + 1);
    }
    minDate.setHours(0, 0, 0, 0);
    
    // Get padding from prev month (0 = Sun, 1 = Mon...)
    // We want Mon = 0, Sun = 6
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const days = [];
    
    // Prev month days
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevLastDay - i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = date < minDate;
      days.push({ day: prevLastDay - i, current: false, month: month - 1, isWeekend, isPast });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < minDate;
      days.push({ day: i, current: true, month, isWeekend, isPast });
    }
    
    // Next month padding to fill 42 cells (6 weeks)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < minDate;
      days.push({ day: i, current: false, month: month + 1, isWeekend, isPast });
    }
    
    return days;
  };

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    
    const names = {
      ru: {
        days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"]
      },
      en: {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      bg: {
        days: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        months: ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"]
      }
    };

    const currentNames = names[language as keyof typeof names] || names.ru;
    return `${currentNames.days[date.getDay()]}, ${date.getDate()} ${currentNames.months[date.getMonth()]}`;
  };

  const currentPrice = selectedFormat === "standard" ? t.bookingWidget.priceStandard : t.bookingWidget.pricePriority;
  const currentFormatName = selectedFormat === "standard" ? t.bookingWidget.formatStandard : t.bookingWidget.formatPriority;

  const stepTitles = [
    t.bookingWidget.step1Title,
    t.bookingWidget.step2Title,
    t.bookingWidget.step3Title,
    t.bookingWidget.step4Title
  ];
  const stepTitle = stepTitles[currentStep] || stepTitles[0];

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  // Render step content based on index
  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formatCards}>
              {/* Standard */}
              <div 
                className={`${styles.formatCard} ${selectedFormat === "standard" ? styles.selected : ""}`}
                onClick={() => setSelectedFormat("standard")}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <div className={styles.cardIcon}>
                      <CalendarIcon color="#8395AC" />
                    </div>
                    <div className={styles.formatName}>{t.bookingWidget.formatStandard}</div>
                  </div>
                  <div className={styles.cardPriceRow}>
                    <div className={styles.priceLabel}>{t.bookingWidget.priceLabel}</div>
                    <div className={styles.priceValue}>
                      <span className={styles.amount}>{t.bookingWidget.priceStandard}</span>
                      <span className={styles.slash}>/</span>
                      <span className={styles.time}>{t.bookingWidget.duration}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.detailItem}>{t.bookingWidget.recordStandard}</div>
                  <div className={styles.detailItem}>{t.bookingWidget.timeStandard}</div>
                </div>
              </div>

              {/* Priority */}
              <div 
                className={`${styles.formatCard} ${selectedFormat === "priority" ? styles.selected : ""}`}
                onClick={() => setSelectedFormat("priority")}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <div className={styles.cardIcon}>
                      <UrgentIcon color="#FC4513" />
                    </div>
                    <div className={styles.formatName}>{t.bookingWidget.formatPriority}</div>
                  </div>
                  <div className={styles.cardPriceRow}>
                    <div className={styles.priceLabel}>{t.bookingWidget.priceLabel}</div>
                    <div className={styles.priceValue}>
                      <span className={styles.amount}>{t.bookingWidget.pricePriority}</span>
                      <span className={styles.slash}>/</span>
                      <span className={styles.time}>{t.bookingWidget.duration}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.detailItem}>{t.bookingWidget.recordPriority}</div>
                  <div className={styles.detailItem}>{t.bookingWidget.timePriority}</div>
                </div>
              </div>
            </div>
            {getFieldError("format") && <div className={styles.errorMessage}>{getFieldError("format")}</div>}

            <div className={styles.meetingTypes}>
              <div 
                className={`${styles.meetingOption} ${meetingType === "sofia" ? styles.selected : ""}`}
                onClick={() => setMeetingType("sofia")}
              >
                <div className={`${styles.checkbox} ${meetingType === "sofia" ? styles.checked : ""}`}>
                  {meetingType === "sofia" && <CheckIcon pure />}
                </div>
                <div className={styles.meetingLabel}>{t.bookingWidget.meetingSofia}</div>
              </div>
              <div 
                className={`${styles.meetingOption} ${meetingType === "zoom" ? styles.selected : ""}`}
                onClick={() => setMeetingType("zoom")}
              >
                <div className={`${styles.checkbox} ${meetingType === "zoom" ? styles.checked : ""}`}>
                  {meetingType === "zoom" && <CheckIcon pure />}
                </div>
                <div className={styles.meetingLabel}>{t.bookingWidget.meetingZoom}</div>
              </div>
              {getFieldError("meetingType") && <div className={styles.errorMessage}>{getFieldError("meetingType")}</div>}
            </div>

            <Button 
              variant="consultationMobile" 
              onClick={handleNext}
              className={styles.submitBtn}
            >
              {t.bookingWidget.btnSelect}
            </Button>
          </div>
        );

      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.formFields}>
              {/* Name */}
              <div className={styles.formField}>
                <label className={styles.label}>{t.bookingWidget.labelName}</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder={t.bookingWidget.placeholderName}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {getFieldError("name") && <div className={styles.errorMessage}>{getFieldError("name")}</div>}
              </div>

              {/* Phone */}
              <div className={styles.formField}>
                <label className={styles.label}>{t.bookingWidget.labelPhone}</label>
                <div className={styles.phoneInputWrapper}>
                  <div className={styles.countryPrefix}>
                    <div className={styles.flag}>
                      <div className={styles.flagBg} />
                      <div className={styles.flagRed} />
                      <div className={styles.flagWhite} />
                    </div>
                    <span className={styles.prefix}>+359</span>
                  </div>
                    <input 
                      type="tel" 
                      className={styles.phoneInput} 
                      placeholder="xxx-xxx-xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                  {getFieldError("phone") && <div className={styles.errorMessage}>{getFieldError("phone")}</div>}
                </div>

              {/* Email */}
              <div className={styles.formField}>
                <label className={styles.label}>{t.bookingWidget.labelEmail}</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  placeholder={t.bookingWidget.placeholderEmail}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {getFieldError("email") && <div className={styles.errorMessage}>{getFieldError("email")}</div>}
              </div>

              {/* Message */}
              <div className={styles.formField}>
                <label className={styles.label}>{t.bookingWidget.labelMessage}</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder={t.bookingWidget.placeholderMessage}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.navigationRow}>
              <button className={styles.backBtn} onClick={handleBack}>
                <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                  <path d="M9.5 17.5L1.5 9.5L9.5 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Button 
                variant="consultationMobile" 
                onClick={handleNext}
                className={styles.submitBtn}
              >
                {t.bookingWidget.btnNext}
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.dateTimeFields}>
              {/* Date Selection */}
              <div className={styles.formField}>
                <label className={styles.label}>{t.bookingWidget.labelDate}</label>
                <div className={styles.dateSelector}>
                  <div 
                    className={styles.dateInput} 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    {selectedDate ? (
                      <span>{formatDate(selectedDate)}</span>
                    ) : (
                      <span className={styles.placeholder}>{t.bookingWidget.placeholderDate}</span>
                    )}
                    <div className={`${styles.arrow} ${isCalendarOpen ? styles.open : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="#8395AC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isCalendarOpen && (
                      <motion.div 
                        className={styles.calendarWrapper}
                        initial={{ opacity: 0, height: 0, paddingTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', paddingTop: 12 }}
                        exit={{ opacity: 0, height: 0, paddingTop: 0 }}
                        style={{ overflow: 'hidden' }}
                        transition={{ 
                          duration: 0.35, 
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                      >
                        <div className={styles.calendarHeader}>
                          <div className={styles.monthYear}>
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                          </div>
                          <div className={styles.calendarNav}>
                            <button className={styles.navBtn} onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button className={styles.navBtn} onClick={(e) => { e.stopPropagation(); changeMonth(1); }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className={styles.calendarBody}>
                          <div className={styles.weekDays}>
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                              <div key={day} className={styles.weekDay}>{day}</div>
                            ))}
                          </div>
                          <div className={styles.daysGrid}>
                            {generateDays().map((item, i) => {
                              const isSelected = selectedDate && 
                                                selectedDate.getDate() === item.day && 
                                                selectedDate.getMonth() === item.month &&
                                                selectedDate.getFullYear() === viewDate.getFullYear();

                              return (
                                <div 
                                  key={i} 
                                  className={`${styles.dayCell} ${!item.current ? styles.outside : ''} ${isSelected ? styles.selected : ''} ${item.isWeekend ? styles.weekend : ''} ${item.isPast ? styles.disabled : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.current && !item.isWeekend && !item.isPast) {
                                      setSelectedDate(new Date(viewDate.getFullYear(), item.month, item.day));
                                      // Removed automatic closing on select
                                    }
                                  }}
                                >
                                  {item.day}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {getFieldError("date") && <div className={styles.errorMessage}>{getFieldError("date")}</div>}
                </div>
              </div>

              {/* Time Selection */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div 
                    className={styles.formField}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className={styles.label}>{t.bookingWidget.labelTime}</label>
                    <div className={styles.timeSlots}>
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                        <button 
                          key={time}
                          className={`${styles.timeSlot} ${selectedTime === time ? styles.active : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                      {getFieldError("time") && <div className={styles.errorMessage}>{getFieldError("time")}</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.navigationRow}>
              <button className={styles.backBtn} onClick={handleBack}>
                <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                  <path d="M9.5 17.5L1.5 9.5L9.5 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Button 
                variant="consultationMobile" 
                onClick={handleNext}
                className={styles.submitBtn}
              >
                {t.bookingWidget.btnNext}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>{t.bookingWidget.labelSummaryConsultation}</span>
                <div className={styles.summaryValueWrapper}>
                  <div className={styles.summaryValue}>{currentFormatName}</div>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>{t.bookingWidget.labelSummaryDate}</span>
                <div className={styles.summaryValueWrapper}>
                  <div className={styles.summaryValue}>{formatDate(selectedDate)}</div>
                </div>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>{t.bookingWidget.labelSummaryTime}</span>
                <div className={styles.summaryValueWrapper}>
                  <div className={styles.summaryValue}>{selectedTime}</div>
                </div>
              </div>
            </div>

            <div className={styles.paymentRow}>
              <span className={styles.paymentLabel}>{t.bookingWidget.labelTotalAmount}</span>
              <span className={styles.paymentValue}>{currentPrice} (EUR)</span>
            </div>

            <div className={styles.navigationRow}>
              <button className={styles.backBtn} onClick={handleBack}>
                <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                  <path d="M9.5 17.5L1.5 9.5L9.5 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Button 
                variant="consultationMobile" 
                onClick={() => { if (isStepValid(3)) console.log("Pay", { format: selectedFormat, formData, selectedDate, selectedTime }); else setShowErrors(true); }}
                className={styles.submitBtn}
              >
                {t.bookingWidget.btnPay}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.widgetCard} id="booking-form">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.stepperRow}>
          <div className={styles.stepNumberWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={styles.stepNumber}
              >
                {currentStep + 1}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.pagination}>
            {[...Array(stepsCount)].map((_, index) => (
              <div
                key={index}
                className={`${styles.dotWrapper} ${index === currentStep ? styles.active : ""} ${index > currentStep ? styles.disabled : ""}`}
                onClick={() => goToStep(index)}
              />
            ))}
            
            <motion.div
              className={styles.activePill}
              initial={false}
              animate={{
                x: currentStep > prevStep 
                  ? [startX, startX, targetX] 
                  : [startX, targetX, targetX],
                width: [51, 51 + distance, 51]
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
        <h2 className={styles.stepTitle}>{stepTitle}</h2>
      </div>

      {/* Step Content — only the active step is in the DOM */}
      <motion.div 
        className={styles.stepContainer}
        animate={{ height: contentHeight }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            ref={contentRef}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep(currentStep)}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
