import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storageService';
import { Employee, EmployeeShift, EmployeeAdvance, EmployeePaymentMethod, EmployeePaymentType, ShiftPaymentStatus, WageType, ScheduleType } from '../types';
import {
  Users,
  Clock,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Search,
  Filter,
  Trash2,
  Edit2,
  DollarSign,
  Briefcase,
  Phone,
  Printer,
  ChevronDown,
  X,
  Sparkles,
  ArrowUpDown,
  Coffee,
  Check,
  Building2,
  Zap,
  CalendarDays,
  RotateCcw,
  Wallet,
  Receipt
} from 'lucide-react';

const WEEK_DAYS = [
  { id: 1, name: 'الاثنين' },
  { id: 2, name: 'الثلاثاء' },
  { id: 3, name: 'الأربعاء' },
  { id: 4, name: 'الخميس' },
  { id: 5, name: 'الجمعة' },
  { id: 6, name: 'السبت' },
  { id: 0, name: 'الأحد' },
];

const QUICK_HOURS = [4, 6, 7.5, 8, 9, 10, 12];
const COMMON_ROLES = ['معلم شاورما', 'كاشير وصالة', 'شيف معجنات', 'مساعد مطبخ', 'سائق توصيل'];

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(StorageService.getEmployees());
  const [shifts, setShifts] = useState<EmployeeShift[]>(StorageService.getEmployeeShifts());
  const [advances, setAdvances] = useState<EmployeeAdvance[]>(StorageService.getEmployeeAdvances());

  // Active Tab: 'shifts' | 'advances' | 'directory'
  const [activeTab, setActiveTab] = useState<'shifts' | 'advances' | 'directory'>('shifts');

  // Filters
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editingAdvanceId, setEditingAdvanceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simplified Shift Form State
  const [shiftEmpId, setShiftEmpId] = useState('');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftHours, setShiftHours] = useState<number>(8);
  const [shiftRate, setShiftRate] = useState<number>(12);
  const [shiftPaymentStatus, setShiftPaymentStatus] = useState<ShiftPaymentStatus>('unpaid');
  const [shiftWageType, setShiftWageType] = useState<WageType>('hourly');
  const [shiftNotes, setShiftNotes] = useState('');
  // Collapsible Detailed times (start/end/break)
  const [showDetailedTimes, setShowDetailedTimes] = useState(false);
  const [shiftStart, setShiftStart] = useState('10:00');
  const [shiftEnd, setShiftEnd] = useState('18:00');
  const [shiftBreak, setShiftBreak] = useState<number>(30);

  // Advance Form State (سلف وسحبيات كاش)
  const [advanceEmpId, setAdvanceEmpId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState<number>(50);
  const [advanceDate, setAdvanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [advanceMethod, setAdvanceMethod] = useState<EmployeePaymentMethod>('cash');
  const [advanceType, setAdvanceType] = useState<EmployeePaymentType>('advance');
  const [advanceNotes, setAdvanceNotes] = useState('سلفة نقدية من الكاش');

  // Simplified Employee Form State
  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState('معلم شاورما');
  const [empWageType, setEmpWageType] = useState<WageType>('hourly');
  const [empRate, setEmpRate] = useState<number>(12.5);
  const [empScheduleType, setEmpScheduleType] = useState<ScheduleType>('fixed');
  const [empDefaultHours, setEmpDefaultHours] = useState<number>(8);
  // Collapsible Advanced schedule details (start/end/days)
  const [showAdvancedEmpSchedule, setShowAdvancedEmpSchedule] = useState(false);
  const [empDefaultStart, setEmpDefaultStart] = useState('10:00');
  const [empDefaultEnd, setEmpDefaultEnd] = useState('18:00');
  const [empDefaultBreak, setEmpDefaultBreak] = useState(30);
  const [empWorkingDays, setEmpWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [empIsActive, setEmpIsActive] = useState(true);
  const [empStartDate, setEmpStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [empNotes, setEmpNotes] = useState('');

  const reloadData = () => {
    setEmployees(StorageService.getEmployees());
    setShifts(StorageService.getEmployeeShifts());
    setAdvances(StorageService.getEmployeeAdvances());
  };

  useEffect(() => {
    return StorageService.subscribe(reloadData);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper date boundaries
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDayName = useMemo(() => {
    return new Date().toLocaleDateString('ar-NL', { weekday: 'long' });
  }, []);

  const { startOfWeekStr, startOfMonthStr } = useMemo(() => {
    const now = new Date();
    // Monday as start of week
    const day = now.getDay();
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diffToMon);
    const startOfWeek = mon.toISOString().split('T')[0];

    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonth = firstOfMonth.toISOString().split('T')[0];

    return { startOfWeekStr: startOfWeek, startOfMonthStr: startOfMonth };
  }, []);

  // Fixed staff who are scheduled for today but haven't had their shift logged yet
  const unloggedFixedToday = useMemo(() => {
    return StorageService.getUnloggedFixedStaff(todayStr);
  }, [employees, shifts, todayStr]);

  // Quick action: Generate today's shifts for all fixed staff
  const handleQuickLogFixedToday = () => {
    const res = StorageService.generateTodayFixedShifts(todayStr);
    if (res.addedCount > 0) {
      showToast(`⚡ تم تسجيل ورديات اليوم لـ (${res.addedCount}) موظف ثابت بنجاح!`);
    } else {
      showToast('جميع الموظفين ذوي الدوام الثابت تم تسجيل وردياتهم لليوم مسبقاً.');
    }
  };

  // Quick action: Generate full week shifts for all fixed staff
  const handleQuickLogFixedWeek = () => {
    if (window.confirm('هل تود تعبئة ورديات الأسبوع كاملاً للموظفين ذوي الدوام الثابت وفق أيام وساعات عملهم المعتمدة؟')) {
      const res = StorageService.generateWeekFixedShifts(startOfWeekStr);
      showToast(`⚡ تم إنشاء (${res.addedCount}) وردية للأسبوع الحالي للموظفين الثابتين بنجاح!`);
    }
  };

  // Filter Shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      // Period filter
      if (periodFilter === 'today' && s.date !== todayStr) return false;
      if (periodFilter === 'week' && s.date < startOfWeekStr) return false;
      if (periodFilter === 'month' && s.date < startOfMonthStr) return false;

      // Employee filter
      if (selectedEmployeeId !== 'all' && s.employeeId !== selectedEmployeeId) return false;

      // Payment status filter
      if (statusFilter !== 'all' && s.paymentStatus !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const emp = employees.find((e) => e.id === s.employeeId);
        const nameMatch = s.employeeName.toLowerCase().includes(q) || (emp && emp.name.toLowerCase().includes(q));
        const noteMatch = s.notes?.toLowerCase().includes(q);
        if (!nameMatch && !noteMatch) return false;
      }

      return true;
    });
  }, [shifts, periodFilter, selectedEmployeeId, statusFilter, searchQuery, employees, todayStr, startOfWeekStr, startOfMonthStr]);

  // Filter Advances (سلف ودفعات نقدية مسحوبة)
  const filteredAdvances = useMemo(() => {
    return advances.filter((a) => {
      // Period filter
      if (periodFilter === 'today' && a.date !== todayStr) return false;
      if (periodFilter === 'week' && a.date < startOfWeekStr) return false;
      if (periodFilter === 'month' && a.date < startOfMonthStr) return false;

      // Employee filter
      if (selectedEmployeeId !== 'all' && a.employeeId !== selectedEmployeeId) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const emp = employees.find((e) => e.id === a.employeeId);
        const nameMatch = a.employeeName.toLowerCase().includes(q) || (emp && emp.name.toLowerCase().includes(q));
        const noteMatch = a.notes?.toLowerCase().includes(q);
        if (!nameMatch && !noteMatch) return false;
      }

      return true;
    });
  }, [advances, periodFilter, selectedEmployeeId, searchQuery, employees, todayStr, startOfWeekStr, startOfMonthStr]);

  // Overall Stats based on filtered shifts and filtered advances
  const stats = useMemo(() => {
    return StorageService.getEmployeeStats(filteredShifts, filteredAdvances);
  }, [filteredShifts, filteredAdvances, employees]);

  // Calculated live shift hours and wage
  const liveShiftCalculation = useMemo(() => {
    let netHours = 0;
    if (!showDetailedTimes) {
      netHours = Number(shiftHours) || 0;
    } else {
      const [sH, sM] = (shiftStart || '00:00').split(':').map(Number);
      const [eH, eM] = (shiftEnd || '00:00').split(':').map(Number);
      let durMinutes = (eH * 60 + (eM || 0)) - (sH * 60 + (sM || 0));
      if (durMinutes < 0) {
        durMinutes += 24 * 60; // overnight
      }
      const netMinutes = Math.max(0, durMinutes - (Number(shiftBreak) || 0));
      netHours = Number((netMinutes / 60).toFixed(2));
    }

    const rate = Number(shiftRate) || 0;
    let totalEarned = 0;
    if (shiftWageType === 'daily') {
      totalEarned = Number(rate.toFixed(2));
    } else if (shiftWageType === 'weekly') {
      const targetEmp = employees.find((e) => e.id === shiftEmpId);
      const days = (targetEmp?.workingDays && targetEmp.workingDays.length > 0) ? targetEmp.workingDays.length : 6;
      totalEarned = Number((rate / days).toFixed(2));
    } else {
      totalEarned = Number((netHours * rate).toFixed(2));
    }

    return { netHours, totalEarned };
  }, [showDetailedTimes, shiftHours, shiftStart, shiftEnd, shiftBreak, shiftRate, shiftWageType, shiftEmpId, employees]);

  // Map of shifts recorded for today by employee ID
  const todayShiftsMap = useMemo(() => {
    const map = new Map<string, EmployeeShift>();
    shifts.filter(s => s.date === todayStr).forEach(s => map.set(s.employeeId, s));
    return map;
  }, [shifts, todayStr]);

  // Handle employee select in shift modal to auto-populate rate and defaults
  const handleShiftEmpChange = (empId: string) => {
    setShiftEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      if (emp.wageType) setShiftWageType(emp.wageType);
      if (emp.rate) setShiftRate(emp.rate);
      if (emp.defaultHours) setShiftHours(emp.defaultHours);
      if (emp.defaultStartTime) setShiftStart(emp.defaultStartTime);
      if (emp.defaultEndTime) setShiftEnd(emp.defaultEndTime);
      if (emp.defaultBreakMinutes !== undefined) setShiftBreak(emp.defaultBreakMinutes);
    }
  };

  // Open Shift Modal for create
  const handleOpenAddShift = (defaultEmpId?: string) => {
    setEditingShiftId(null);
    const targetEmp = defaultEmpId 
      ? employees.find(e => e.id === defaultEmpId)
      : (employees.find(e => e.isActive) || employees[0]);
      
    setShiftEmpId(targetEmp ? targetEmp.id : '');
    setShiftWageType(targetEmp?.wageType || 'hourly');
    setShiftRate(targetEmp ? targetEmp.rate : 12);
    setShiftHours(targetEmp?.defaultHours || 8);
    setShiftDate(new Date().toISOString().split('T')[0]);
    setShowDetailedTimes(false);
    setShiftStart(targetEmp?.defaultStartTime || '10:00');
    setShiftEnd(targetEmp?.defaultEndTime || '18:00');
    setShiftBreak(targetEmp?.defaultBreakMinutes !== undefined ? targetEmp.defaultBreakMinutes : 30);
    setShiftPaymentStatus('unpaid');
    setShiftNotes('');
    setIsShiftModalOpen(true);
  };

  // Open Shift Modal for edit
  const handleEditShift = (shift: EmployeeShift) => {
    setEditingShiftId(shift.id);
    setShiftEmpId(shift.employeeId);
    const targetEmp = employees.find(e => e.id === shift.employeeId);
    setShiftWageType(shift.wageType || targetEmp?.wageType || 'hourly');
    setShiftDate(shift.date);
    setShiftHours(shift.totalHours);
    setShiftStart(shift.startTime);
    setShiftEnd(shift.endTime);
    setShiftBreak(shift.breakMinutes || 0);
    setShiftRate(shift.hourlyRate);
    setShiftPaymentStatus(shift.paymentStatus);
    setShiftNotes(shift.notes || '');
    setShowDetailedTimes(false);
    setIsShiftModalOpen(true);
  };

  // Save Shift
  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftEmpId) {
      alert('يرجى اختيار الموظف أولاً');
      return;
    }

    const finalHours = showDetailedTimes ? liveShiftCalculation.netHours : shiftHours;

    StorageService.saveEmployeeShift({
      id: editingShiftId || undefined,
      employeeId: shiftEmpId,
      date: shiftDate,
      startTime: showDetailedTimes ? shiftStart : undefined,
      endTime: showDetailedTimes ? shiftEnd : undefined,
      breakMinutes: showDetailedTimes ? shiftBreak : 0,
      totalHours: finalHours,
      hourlyRate: shiftRate,
      wageType: shiftWageType,
      paymentStatus: shiftPaymentStatus,
      notes: shiftNotes,
    });

    setIsShiftModalOpen(false);
    showToast(editingShiftId ? 'تم تعديل بيانات الوردية بنجاح!' : 'تم تسجيل الوردية واحتساب المستحقات بنجاح!');
  };

  // 1-Click Fast Check-In for today
  const handle1ClickCheckIn = (emp: Employee) => {
    const hours = emp.defaultHours || 8;
    StorageService.logShiftQuickForEmployee(emp.id, todayStr, hours);
    showToast(`⚡ تم تسجيل دوام اليوم لـ (${emp.name}) بواقع ${hours} ساعات!`);
  };

  // Quick Settle Shift Payment (Cash)
  const handleQuickPayShift = (shift: EmployeeShift, status: ShiftPaymentStatus) => {
    StorageService.updateShiftPayment(shift.id, status);
    showToast(status === 'paid_cash' ? 'تم تأكيد تسليم اليومية نقداً (كاش)!' : status === 'paid_bank' ? 'تم تسجيل الدفع بالتحويل البنكي!' : 'تم إعادة تعيين الوردية كمعلقة غير مدفوعة.');
  };

  // Delete Shift
  const handleDeleteShift = (id: string) => {
    if (window.confirm('هل تود حذف سجل هذه الوردية نهائياً؟')) {
      setShifts((prev) => prev.filter((s) => s.id !== id));
      StorageService.deleteEmployeeShift(id);
      showToast('تم حذف الوردية بنجاح.');
    }
  };

  // Open Employee Modal for create
  const handleOpenAddEmp = () => {
    setEditingEmpId(null);
    setEmpName('');
    setEmpPhone('');
    setEmpRole('معلم شاورما');
    setEmpWageType('hourly');
    setEmpRate(12.5);
    setEmpScheduleType('fixed');
    setEmpDefaultHours(8);
    setShowAdvancedEmpSchedule(false);
    setEmpDefaultStart('10:00');
    setEmpDefaultEnd('18:00');
    setEmpDefaultBreak(30);
    setEmpWorkingDays([1, 2, 3, 4, 5, 6, 0]);
    setEmpIsActive(true);
    setEmpStartDate(new Date().toISOString().split('T')[0]);
    setEmpNotes('');
    setIsEmpModalOpen(true);
  };

  // Open Employee Modal for edit
  const handleEditEmp = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEmpName(emp.name);
    setEmpPhone(emp.phone || '');
    setEmpRole(emp.role);
    setEmpWageType(emp.wageType);
    setEmpRate(emp.rate);
    setEmpScheduleType(emp.scheduleType || 'fixed');
    setEmpDefaultHours(emp.defaultHours || 8);
    setShowAdvancedEmpSchedule(false);
    setEmpDefaultStart(emp.defaultStartTime || '10:00');
    setEmpDefaultEnd(emp.defaultEndTime || '18:00');
    setEmpDefaultBreak(emp.defaultBreakMinutes !== undefined ? emp.defaultBreakMinutes : 30);
    setEmpWorkingDays(emp.workingDays || [1, 2, 3, 4, 5, 6, 0]);
    setEmpIsActive(emp.isActive);
    setEmpStartDate(emp.startDate || '');
    setEmpNotes(emp.notes || '');
    setIsEmpModalOpen(true);
  };

  // Save Employee
  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) {
      alert('يرجى إدخال اسم الموظف');
      return;
    }

    StorageService.saveEmployee({
      id: editingEmpId || undefined,
      name: empName,
      phone: empPhone,
      role: empRole,
      wageType: empWageType,
      rate: empRate,
      scheduleType: empScheduleType,
      defaultHours: empDefaultHours,
      defaultStartTime: empDefaultStart,
      defaultEndTime: empDefaultEnd,
      defaultBreakMinutes: empDefaultBreak,
      workingDays: empWorkingDays,
      isActive: empIsActive,
      startDate: empStartDate,
      notes: empNotes,
    });

    setIsEmpModalOpen(false);
    showToast(editingEmpId ? 'تم تحديث بيانات الموظف بنجاح!' : 'تمت إضافة الموظف الجديد بنجاح!');
  };

  // Delete Employee
  const handleDeleteEmp = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الموظف "${name}"؟ ستظل وردياته السابقة محفوظة للتوثيق.`)) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      StorageService.deleteEmployee(id);
      showToast(`تم حذف الموظف "${name}" من القائمة.`);
    }
  };

  // Print Timesheet
  const handlePrint = () => {
    window.print();
  };

  // Open Advance Modal for create
  const handleOpenAddAdvance = (defaultEmpId?: string, defaultAmount: number = 50) => {
    setEditingAdvanceId(null);
    const targetEmp = defaultEmpId 
      ? employees.find(e => e.id === defaultEmpId)
      : (employees.find(e => e.isActive) || employees[0]);

    setAdvanceEmpId(targetEmp ? targetEmp.id : '');
    setAdvanceAmount(defaultAmount);
    setAdvanceDate(new Date().toISOString().split('T')[0]);
    setAdvanceMethod('cash');
    setAdvanceType('advance');
    setAdvanceNotes('سلفة نقدية من الكاش');
    setIsAdvanceModalOpen(true);
  };

  // Open Advance Modal for edit
  const handleEditAdvance = (adv: EmployeeAdvance) => {
    setEditingAdvanceId(adv.id);
    setAdvanceEmpId(adv.employeeId);
    setAdvanceAmount(adv.amount);
    setAdvanceDate(adv.date);
    setAdvanceMethod(adv.paymentMethod);
    setAdvanceType(adv.paymentType);
    setAdvanceNotes(adv.notes || '');
    setIsAdvanceModalOpen(true);
  };

  // Save Advance
  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceEmpId) {
      alert('يرجى اختيار الموظف أولاً');
      return;
    }
    if (!advanceAmount || advanceAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح للسلفة');
      return;
    }

    StorageService.saveEmployeeAdvance({
      id: editingAdvanceId || undefined,
      employeeId: advanceEmpId,
      amount: Number(advanceAmount),
      date: advanceDate,
      paymentMethod: advanceMethod,
      paymentType: advanceType,
      notes: advanceNotes,
    });

    setIsAdvanceModalOpen(false);
    const targetEmp = employees.find(e => e.id === advanceEmpId);
    showToast(editingAdvanceId 
      ? 'تم تعديل بيانات السلفة/الدفعة بنجاح!' 
      : `💵 تم قيد سلفة بقيمة €${Number(advanceAmount).toFixed(2)} لـ (${targetEmp?.name || 'الموظف'}) بنجاح!`);
  };

  // Delete Advance
  const handleDeleteAdvance = (id: string) => {
    if (window.confirm('هل تود حذف سجل هذه الدفعة/السلفة؟')) {
      setAdvances((prev) => prev.filter((a) => a.id !== id));
      StorageService.deleteEmployeeAdvance(id);
      showToast('تم حذف سجل السلفة بنجاح.');
    }
  };

  // Calculate stats per individual employee (with shifts + advances)
  const employeeBalances = useMemo(() => {
    const map: Record<string, { 
      totalHours: number; 
      totalEarned: number; 
      paidShifts: number; 
      advances: number; 
      totalPaid: number; 
      netRemaining: number; 
      shiftCount: number;
      advancesCount: number;
    }> = {};

    employees.forEach(e => {
      map[e.id] = { 
        totalHours: 0, 
        totalEarned: 0, 
        paidShifts: 0, 
        advances: 0, 
        totalPaid: 0, 
        netRemaining: 0, 
        shiftCount: 0,
        advancesCount: 0
      };
    });

    shifts.forEach(s => {
      if (!map[s.employeeId]) {
        map[s.employeeId] = { totalHours: 0, totalEarned: 0, paidShifts: 0, advances: 0, totalPaid: 0, netRemaining: 0, shiftCount: 0, advancesCount: 0 };
      }
      const emp = employees.find(e => e.id === s.employeeId);
      const wType = s.wageType || emp?.wageType || 'hourly';
      let earned = s.totalEarned;
      if (wType === 'daily') {
        const expected = emp?.rate || s.hourlyRate || 0;
        if (expected > 0 && earned > expected) {
          earned = expected;
        }
      }
      map[s.employeeId].totalHours += s.totalHours;
      map[s.employeeId].totalEarned += earned;
      map[s.employeeId].paidShifts += (s.paidAmount || 0);
      map[s.employeeId].shiftCount += 1;
    });

    advances.forEach(a => {
      if (!map[a.employeeId]) {
        map[a.employeeId] = { totalHours: 0, totalEarned: 0, paidShifts: 0, advances: 0, totalPaid: 0, netRemaining: 0, shiftCount: 0, advancesCount: 0 };
      }
      map[a.employeeId].advances += a.amount;
      map[a.employeeId].advancesCount += 1;
    });

    // Compute net totals for each employee
    Object.keys(map).forEach(empId => {
      const item = map[empId];
      item.totalPaid = Number((item.paidShifts + item.advances).toFixed(2));
      item.netRemaining = Number((item.totalEarned - item.totalPaid).toFixed(2));
    });

    return map;
  }, [employees, shifts, advances]);

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-tasty-charcoal text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-fade-in text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-tasty-teal-light text-tasty-teal-dark border border-tasty-teal/20 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              إدارة الكوادر وساعات العمل
            </span>
            <span className="text-xs text-gray-400">سجل الدوام والرواتب</span>
          </div>
          <h1 className="font-serif font-black text-2xl text-tasty-charcoal">
            الموظفون والورديات اليومية
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            سجل ساعات الحضور (من ساعة إلى ساعة)، مع خيار الدوام الثابت التلقائي والدوام المرن، ومتابعة تسليم اليوميات والرواتب.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Log Today Fixed Staff Button */}
          <button
            onClick={handleQuickLogFixedToday}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold text-xs transition-all shadow-2xs"
            title="تسجيل دوام الموظفين الثابتين لليوم بضغطة واحدة"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>تسجيل دوام اليوم الثابت</span>
          </button>

          {/* Quick Log Week Fixed Staff Button */}
          <button
            onClick={handleQuickLogFixedWeek}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-bold text-xs transition-all shadow-2xs"
            title="تعبئة ورديات الأسبوع كاملاً للموظفين ذوي الدوام الثابت"
          >
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">تعبئة الأسبوع</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-bold text-xs transition-all shadow-2xs"
            title="طباعة كشف ساعات العمل الحالي"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">طباعة الكشف</span>
          </button>

          <button
            onClick={() => handleOpenAddAdvance()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 hover:border-amber-400 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold text-xs transition-all shadow-2xs active:scale-95"
            title="تسجيل سلفة نقدية أو سحب كاش لموظف"
          >
            <Banknote className="w-4 h-4 text-amber-600" />
            <span>صرف سلفة / سحب كاش</span>
          </button>

          <button
            onClick={handleOpenAddEmp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-tasty-teal/30 hover:border-tasty-teal text-tasty-teal-dark bg-tasty-teal-light/40 hover:bg-tasty-teal-light font-bold text-xs transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-tasty-teal" />
            <span>إضافة موظف</span>
          </button>

          <button
            onClick={() => handleOpenAddShift()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>تسجيل وردية</span>
          </button>
        </div>
      </div>

      {/* Printable Header (Visible only when printing) */}
      <div className="hidden print:block mb-6 p-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">مطعم TASTY — Hilversum</h1>
            <p className="text-xs text-gray-600">كشف ساعات العمل والورديات والأجور المستحقة</p>
          </div>
          <div className="text-left text-xs text-gray-500">
            <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-NL')}</p>
            <p>الفترة: {periodFilter === 'today' ? 'اليوم' : periodFilter === 'week' ? 'هذا الأسبوع' : periodFilter === 'month' ? 'هذا الشهر' : 'كافة السجلات'}</p>
          </div>
        </div>
      </div>

      {/* 4 KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 print:grid-cols-4">
        
        {/* KPI 1: Total Hours */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-gray-500">ساعات العمل ({periodFilter === 'today' ? 'اليوم' : periodFilter === 'week' ? 'الأسبوع' : periodFilter === 'month' ? 'الشهر' : 'الكلي'})</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
              {stats.totalHours}
            </span>
            <span className="text-xs text-gray-400 font-bold">ساعة</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">من إجمالي {stats.totalShiftsCount} وردية مسجلة</p>
        </div>

        {/* KPI 2: Total Wages */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-gray-500">إجمالي الأجور المستحقة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-gray-400 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-tasty-charcoal tabular-nums">
              {stats.totalWages.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">حسب تسعيرة الساعات المعتمدة</p>
        </div>

        {/* KPI 3: Paid Amount */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-gray-500">المدفوع للموظفين</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-emerald-500/70 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-emerald-600 tabular-nums">
              {stats.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80 font-medium mt-1">
            {stats.totalAdvances > 0 
              ? `تشمل €${stats.totalAdvances.toFixed(0)} سلف وسحبيات نقدية` 
              : 'يوميات كاش وتحويلات بنكية'}
          </p>
        </div>

        {/* KPI 4: Unpaid / Pending */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-gray-500">المتبقي في ذمة المطعم</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1" dir="ltr">
            <span className="text-base sm:text-lg font-bold text-rose-500/70 font-sans">€</span>
            <span className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-rose-600 tabular-nums">
              {stats.totalUnpaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-rose-700/80 font-medium mt-1">مستحقات معلقة لم تُسدد بعد</p>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-gray-200/80 pb-2 print:hidden overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('shifts')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'shifts'
                ? 'bg-tasty-charcoal text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span><span className="hidden sm:inline">سجل </span>الورديات<span className="hidden sm:inline"> وساعات العمل</span></span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'shifts' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {filteredShifts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('advances')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'advances'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span><span className="hidden sm:inline">سجل </span>السلف والدفعات<span className="hidden sm:inline"> المسحوبة</span></span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'advances' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-bold'}`}>
              {filteredAdvances.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'directory'
                ? 'bg-tasty-charcoal text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>فريق العمل<span className="hidden sm:inline"> وكشف الحساب</span></span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'directory' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {employees.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: SHIFTS LOG */}
      {activeTab === 'shifts' && (
        <div className="space-y-4">
          
          {/* Quick 1-Click Daily Attendance Panel */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-2xs animate-fade-in print:hidden space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-amber-950">تحضير كادر العمل لليوم ({todayDayName})</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/50">
                      تسجيل سريع بضغطة زر واحدة
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/70 mt-0.5">
                    اضغط زر الحضور الأخضر أمام اسم الموظف لتسجيل ورديته فوراً دون الحاجة لتعبئة أي نماذج!
                  </p>
                </div>
              </div>

              {unloggedFixedToday.length > 0 && (
                <button
                  onClick={handleQuickLogFixedToday}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <Zap className="w-4 h-4" />
                  <span>تسجيل حضور كل الثابتين دفعة واحدة ({unloggedFixedToday.length})</span>
                </button>
              )}
            </div>

            {/* Quick Attendance Employee Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-amber-200/60">
              {employees.filter(e => e.isActive).map((emp) => {
                const todayShift = todayShiftsMap.get(emp.id);
                const isLogged = !!todayShift;

                return (
                  <div
                    key={emp.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isLogged
                        ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-amber-300 shadow-2xs'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900 truncate">{emp.name}</span>
                        {isLogged ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="تم تسجيل حضوره" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="بانتظار التحضير" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {emp.role} • €{emp.rate}
                        <span>
                          {emp.wageType === 'hourly' ? '/س' : emp.wageType === 'daily' ? '/يوم' : '/أسبوع'}
                        </span>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => handleOpenAddAdvance(emp.id, 50)}
                        title="تسجيل سلفة نقدية (كاش)"
                        className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-100/60 transition-colors"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                      </button>

                      {isLogged ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{todayShift.totalHours}س</span>
                            <span className="font-mono text-[10px] text-emerald-900 font-sans tabular-nums">€{todayShift.totalEarned.toFixed(2)}</span>
                          </span>
                          <button
                            onClick={() => handleEditShift(todayShift)}
                            title="تعديل الساعات أو الحساب"
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handle1ClickCheckIn(emp)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs active:scale-95 transition-all"
                            title={`تسجيل حضور اليوم بـ (${emp.defaultHours || 8}) ساعات`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>حضور ({emp.defaultHours || 8}س)</span>
                          </button>
                          <button
                            onClick={() => handleOpenAddShift(emp.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
                            title="تحديد ساعات مخصصة"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
            
            {/* Period Filters */}
            <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-2xl">
              {[
                { id: 'today', label: 'اليوم' },
                { id: 'week', label: 'هذا الأسبوع' },
                { id: 'month', label: 'هذا الشهر' },
                { id: 'all', label: 'كافة الفترات' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriodFilter(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    periodFilter === p.id
                      ? 'bg-white text-tasty-teal-dark shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Select Employee Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold py-2 pr-3 pl-8 rounded-xl focus:outline-hidden focus:border-tasty-teal transition-colors"
                >
                  <option value="all">كل الموظفين ({employees.length})</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role}) {emp.scheduleType === 'fixed' ? '— ثابت' : '— مرن'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold py-2 pr-3 pl-8 rounded-xl focus:outline-hidden focus:border-tasty-teal transition-colors"
                >
                  <option value="all">كل حالات الدفع</option>
                  <option value="unpaid">غير مدفوع (معلق)</option>
                  <option value="paid_cash">مدفوع نقداً (كاش)</option>
                  <option value="paid_bank">مدفوع تحويل بنكي</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الملاحظات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs py-2 pr-8 pl-3 rounded-xl focus:outline-hidden focus:border-tasty-teal w-44 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Shifts Table */}
          {filteredShifts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-gray-700">لا توجد ورديات مسجلة لهذه الفترة</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-4">
                يمكنك الضغط على "تسجيل دوام اليوم الثابت" لتوليد الدوام فوراً، أو إضافة وردية فردية.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleQuickLogFixedToday}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>توليد دوام الموظفين الثابتين لليوم</span>
                </button>
                <button
                  onClick={() => handleOpenAddShift()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tasty-teal text-white text-xs font-bold shadow-xs hover:bg-tasty-teal-dark transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل وردية يدوية</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                      <th className="py-3.5 px-4">التاريخ</th>
                      <th className="py-3.5 px-4">الموظف ونظام دوامه</th>
                      <th className="py-3.5 px-4">أوقات العمل (من - إلى)</th>
                      <th className="py-3.5 px-4">الاستراحة</th>
                      <th className="py-3.5 px-4">صافي الساعات</th>
                      <th className="py-3.5 px-4">الأجر والتعرفة</th>
                      <th className="py-3.5 px-4">المستحق (€)</th>
                      <th className="py-3.5 px-4">حالة الدفع</th>
                      <th className="py-3.5 px-4 print:hidden text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredShifts.map((shift) => {
                      const emp = employees.find((e) => e.id === shift.employeeId);
                      const currentWageType = shift.wageType || emp?.wageType || 'hourly';
                      return (
                        <tr key={shift.id} className="hover:bg-amber-50/20 transition-colors">
                          
                          {/* Date */}
                          <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>{shift.date}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block mr-5">
                              {new Date(shift.date).toLocaleDateString('ar-NL', { weekday: 'short' })}
                            </span>
                          </td>

                          {/* Employee & Schedule Type */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-tasty-charcoal">{shift.employeeName}</div>
                              {emp?.scheduleType === 'fixed' ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                  ثابت
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                                  مرن
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400">{emp?.role || 'موظف'}</span>
                          </td>

                          {/* Times (Start - End) */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200/80 font-mono text-xs font-bold text-gray-800">
                              <span>{shift.startTime}</span>
                              <span className="text-gray-400">←</span>
                              <span>{shift.endTime}</span>
                            </div>
                          </td>

                          {/* Break */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">
                            {shift.breakMinutes > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px]">
                                <Coffee className="w-3 h-3 text-amber-500" />
                                <span>{shift.breakMinutes} د</span>
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>

                          {/* Net Hours */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-tasty-teal-dark">
                            <span className="text-sm">{shift.totalHours}</span>
                            <span className="text-[10px] text-gray-400 font-sans mr-1">ساعة</span>
                          </td>

                          {/* Rate & Wage Type */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-gray-700 font-mono">
                            <span className="font-bold">€{shift.hourlyRate.toFixed(2)}</span>
                            <span className="text-[10px] text-gray-400 font-sans mr-1">
                              {currentWageType === 'daily' ? '/يوم' : currentWageType === 'weekly' ? '/أسبوع' : '/س'}
                            </span>
                          </td>

                          {/* Total Earned */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-baseline gap-0.5 font-sans font-black text-sm text-tasty-charcoal tabular-nums" dir="ltr">
                              <span className="text-xs font-bold text-gray-400 mr-0.5">€</span>
                              <span>{shift.totalEarned.toFixed(2)}</span>
                            </div>
                          </td>

                          {/* Payment Status Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {shift.paymentStatus === 'paid_cash' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>مدفوع كاش</span>
                              </span>
                            ) : shift.paymentStatus === 'paid_bank' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <Building2 className="w-3 h-3" />
                                <span>مدفوع تحويل</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertCircle className="w-3 h-3" />
                                <span>غير مدفوع (معلق)</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 print:hidden text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              
                              {/* Quick Pay Action */}
                              {shift.paymentStatus === 'unpaid' ? (
                                <button
                                  onClick={() => handleQuickPayShift(shift, 'paid_cash')}
                                  title="تسليم اليومية نقداً (كاش)"
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                >
                                  <DollarSign className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleQuickPayShift(shift, 'unpaid')}
                                  title="إعادة تعيين كغير مدفوع"
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  <ArrowUpDown className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleEditShift(shift)}
                                title="تعديل الوردية"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteShift(shift.id)}
                                title="حذف الوردية"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="bg-[#FAF8F5] px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                <div>
                  عدد الورديات المعروضة: <span className="font-bold text-tasty-charcoal">{filteredShifts.length}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>مجموع الساعات: <strong className="text-tasty-teal-dark">{stats.totalHours} ساعة</strong></span>
                  <span>إجمالي المستحقات: <strong className="text-tasty-charcoal">€{stats.totalWages.toFixed(2)}</strong></span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: ADVANCES & CASH PAYMENTS LOG (سجل السلف والدفعات المسحوبة) */}
      {activeTab === 'advances' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Advances Filters & Action Bar */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
            
            {/* Period Filters */}
            <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-2xl">
              {[
                { id: 'today', label: 'اليوم' },
                { id: 'week', label: 'هذا الأسبوع' },
                { id: 'month', label: 'هذا الشهر' },
                { id: 'all', label: 'كافة الفترات' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriodFilter(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    periodFilter === p.id
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Employee Filter & Search & Add Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold py-2 pr-3 pl-8 rounded-xl focus:outline-hidden focus:border-amber-500 transition-colors"
                >
                  <option value="all">كل الموظفين ({employees.length})</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث بالسلف أو الملاحظات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs py-2 pr-8 pl-3 rounded-xl focus:outline-hidden focus:border-amber-500 w-44 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <button
                onClick={() => handleOpenAddAdvance()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل سلفة جديدة</span>
              </button>
            </div>

          </div>

          {/* Advances Mini Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-800 block">إجمالي السلف المسحوبة</span>
              <span className="text-lg font-black text-amber-950 font-sans tabular-nums" dir="ltr">
                € {filteredAdvances.reduce((acc, a) => acc + a.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">سحبيات كاش من الصندوق</span>
              <span className="text-lg font-black text-emerald-950 font-sans tabular-nums" dir="ltr">
                € {filteredAdvances.filter(a => a.paymentMethod === 'cash').reduce((acc, a) => acc + a.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-blue-800 block">تحويلات بنكية</span>
              <span className="text-lg font-black text-blue-950 font-sans tabular-nums" dir="ltr">
                € {filteredAdvances.filter(a => a.paymentMethod === 'bank_transfer').reduce((acc, a) => acc + a.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-gray-600 block">عدد عمليات الصرف</span>
              <span className="text-lg font-black text-gray-900 font-sans tabular-nums">
                {filteredAdvances.length} عملية
              </span>
            </div>
          </div>

          {/* Advances Table */}
          {filteredAdvances.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Banknote className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-800">لا توجد سلف أو دفعات مسجلة لهذه الفترة</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                عندما يأخذ أحد الشباب سلفة أو دفعة نقدية من الكاش، يمكنك توثيقها هنا لخصمها فوراً من حسابه ومستحقاته.
              </p>
              <button
                onClick={() => handleOpenAddAdvance()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل سلفة نقدية الآن</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100 text-[11px]">
                    <tr>
                      <th className="py-3 px-4">الموظف</th>
                      <th className="py-3 px-4">التاريخ</th>
                      <th className="py-3 px-4">المبلغ المسحوب</th>
                      <th className="py-3 px-4">طريقة الصرف</th>
                      <th className="py-3 px-4">نوع الحركة</th>
                      <th className="py-3 px-4">البيان والملاحظات</th>
                      <th className="py-3 px-4 text-left print:hidden">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdvances.map((adv) => {
                      const emp = employees.find(e => e.id === adv.employeeId);
                      return (
                        <tr key={adv.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                                {adv.employeeName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 block">{adv.employeeName}</span>
                                <span className="text-[10px] text-gray-400">{emp?.role || 'موظف'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-gray-600" dir="ltr">
                            {adv.date}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-black text-sm text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/70" dir="ltr">
                              € {adv.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {adv.paymentMethod === 'cash' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                💵 كاش من الصندوق
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                💳 تحويل بنكي
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold text-gray-600">
                              {adv.paymentType === 'advance' ? 'سلفة على الحساب' : adv.paymentType === 'salary_settlement' ? 'دفعة من الراتب' : adv.paymentType === 'bonus' ? 'مكافأة' : 'أخرى'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                            {adv.notes || <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-3.5 px-4 text-left print:hidden">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditAdvance(adv)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="تعديل السلفة"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdvance(adv.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="حذف السلفة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="bg-[#FAF8F5] px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                <div>
                  عدد السحبيات المعروضة: <span className="font-bold text-tasty-charcoal">{filteredAdvances.length}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>إجمالي المبالغ المسحوبة: <strong className="text-amber-800">€{filteredAdvances.reduce((acc, a) => acc + a.amount, 0).toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: EMPLOYEES DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => {
              const b = employeeBalances[emp.id] || { totalHours: 0, totalEarned: 0, paid: 0, unpaid: 0, shiftCount: 0 };
              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  
                  <div>
                    {/* Top Row: Name, Status & Role */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-tasty-charcoal">{emp.name}</h3>
                          {emp.isActive ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="نشط" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-300" title="متوقف" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700">
                            {emp.role}
                          </span>
                          {emp.scheduleType === 'fixed' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                              <Clock className="w-2.5 h-2.5" /> دوام ثابت
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                              <Zap className="w-2.5 h-2.5" /> دوام مرن
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <span className="text-base font-black text-tasty-teal-dark">€{emp.rate.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 block font-sans">
                          {emp.wageType === 'hourly' ? '/ ساعة' : emp.wageType === 'daily' ? '/ يوم' : emp.wageType === 'weekly' ? '/ أسبوع' : '/ شهر'}
                        </span>
                      </div>
                    </div>

                    {/* Fixed Schedule Details (If fixed) */}
                    {emp.scheduleType === 'fixed' && (
                      <div className="mt-2.5 mb-2.5 p-2.5 bg-blue-50/50 rounded-2xl border border-blue-100 text-[11px] text-gray-700 space-y-1">
                        <div className="flex items-center justify-between font-bold text-blue-900">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>ساعات الدوام:</span>
                          </span>
                          <span className="font-mono text-xs text-blue-800">
                            {emp.defaultStartTime || '10:00'} ← {emp.defaultEndTime || '18:00'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {WEEK_DAYS.map((wd) => {
                            const isScheduled = !emp.workingDays || emp.workingDays.length === 0 || emp.workingDays.includes(wd.id);
                            return (
                              <span
                                key={wd.id}
                                className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                                  isScheduled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 line-through'
                                }`}
                              >
                                {wd.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Contact & Notes */}
                    {emp.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span dir="ltr">{emp.phone}</span>
                      </div>
                    )}
                    {emp.notes && (
                      <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 italic">
                        "{emp.notes}"
                      </p>
                    )}

                    {/* Stats Balance Box: Hours, Earned, Advances Taken, Net Remaining */}
                    <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 mb-4 grid grid-cols-4 gap-1 text-center">
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">الساعات</span>
                        <span className="text-xs font-bold text-gray-800">{b.totalHours}س</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">المستحق</span>
                        <span className="text-xs font-bold text-gray-800">€{b.totalEarned.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-amber-700 block font-bold">السلف</span>
                        <span className="text-xs font-bold text-amber-800">€{b.advances.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">المتبقي له</span>
                        <span className={`text-xs font-black ${b.netRemaining > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          €{b.netRemaining.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleOpenAddShift(emp.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-tasty-teal-light/40 hover:bg-tasty-teal-light text-tasty-teal-dark text-[11px] font-bold transition-colors"
                      title="تسجيل وردية"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>وردية</span>
                    </button>

                    <button
                      onClick={() => handleOpenAddAdvance(emp.id, 50)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors"
                      title="صرف سلفة نقدية من الكاش"
                    >
                      <Banknote className="w-3.5 h-3.5 text-amber-600" />
                      <span>سلفة كاش</span>
                    </button>

                    <button
                      onClick={() => handleEditEmp(emp)}
                      title="تعديل الموظف"
                      className="p-1.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteEmp(emp.id, emp.name)}
                      title="حذف الموظف"
                      className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* MODAL 1: ADD / EDIT SHIFT */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-tasty-teal-light text-tasty-teal-dark flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-tasty-charcoal">
                    {editingShiftId ? 'تعديل وردية العمل' : 'تسجيل وردية عمل سريعة'}
                  </h3>
                  <p className="text-[11px] text-gray-400">سجل ساعات الحضور والأجر بنقرة واحدة</p>
                </div>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-4 text-xs">
              
              {/* Employee Selection */}
              <div>
                <label className="block font-bold text-gray-800 mb-1.5 text-xs">الموظف *</label>
                <select
                  value={shiftEmpId}
                  onChange={(e) => handleShiftEmpChange(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white transition-colors"
                >
                  <option value="">-- اختر الموظف --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.role} (الأجر: €{emp.rate}/ساعة)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block font-bold text-gray-800 mb-1.5 text-xs">تاريخ الوردية *</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white transition-colors"
                />
              </div>

              {/* PRIMARY: FAST HOURS SELECTION */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-950 text-xs">
                    كم ساعة عمل اليوم؟ ⏱️
                  </label>
                  <span className="text-[11px] text-amber-800/80 font-medium">اختر زراً سريعاً أو اكتب الرقم</span>
                </div>

                {/* Quick Hours Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {QUICK_HOURS.map((h) => {
                    const isSelected = !showDetailedTimes && Number(shiftHours) === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          setShiftHours(h);
                          setShowDetailedTimes(false);
                        }}
                        className={`py-1.5 px-3 rounded-xl font-black text-xs transition-all ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs scale-105'
                            : 'bg-white text-gray-700 border border-amber-200/80 hover:bg-amber-100/60'
                        }`}
                      >
                        {h} {h === 8 ? 'س (كامل)' : 'س'}
                      </button>
                    );
                  })}
                </div>

                {/* Direct Number Input */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-gray-600">أو عدد ساعات مخصص:</span>
                  <div className="relative w-28">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={showDetailedTimes ? liveShiftCalculation.netHours : shiftHours}
                      onChange={(e) => {
                        setShiftHours(parseFloat(e.target.value) || 0);
                        setShowDetailedTimes(false);
                      }}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-black font-sans text-center text-tasty-charcoal focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600">ساعة</span>
                </div>
              </div>

              {/* Hourly / Daily Rate & Quick Total */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {shiftWageType === 'daily' 
                      ? 'قيمة اليومية (€) *' 
                      : shiftWageType === 'weekly' 
                        ? 'المبلغ الأسبوعي (€) *' 
                        : 'أجر الساعة (€) *'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={shiftRate}
                    onChange={(e) => setShiftRate(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs font-mono font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white"
                  />
                </div>

                {/* Live Preview Box */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-tasty-teal-light/60 to-emerald-50 border border-tasty-teal/20 flex flex-col justify-center text-left">
                  <span className="text-[10px] text-gray-500 font-bold block text-right">
                    {shiftWageType === 'daily' 
                      ? 'المستحق (يومية ثابتة):' 
                      : shiftWageType === 'weekly' 
                        ? 'المستحق (حصة اليوم):' 
                        : 'المستحق الإجمالي:'}
                  </span>
                  <div className="flex items-baseline gap-0.5 text-lg font-sans font-black text-tasty-charcoal tabular-nums justify-end" dir="ltr">
                    <span className="text-xs font-bold text-gray-400 mr-0.5">€</span>
                    <span>{liveShiftCalculation.totalEarned.toFixed(2)}</span>
                  </div>
                  <span className="text-[9px] text-gray-400 text-right mt-0.5">
                    {shiftWageType === 'daily' 
                      ? 'يومية كاملة مقطوعة' 
                      : shiftWageType === 'weekly' 
                        ? 'حصة دوام اليوم' 
                        : `${liveShiftCalculation.netHours}س × €${shiftRate}`}
                  </span>
                </div>
              </div>

              {/* Optional: Collapsible Time Pickers (Start/End/Break) */}
              <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setShowDetailedTimes(!showDetailedTimes)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>تحديد وقت الدخول والخروج بالدقيقة والاستراحة (اختياري)</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDetailedTimes ? 'rotate-180' : ''}`} />
                </button>

                {showDetailedTimes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-gray-600 mb-1 text-[11px]">من الساعة (دخول)</label>
                        <input
                          type="time"
                          value={shiftStart}
                          onChange={(e) => setShiftStart(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-600 mb-1 text-[11px]">إلى الساعة (خروج)</label>
                        <input
                          type="time"
                          value={shiftEnd}
                          onChange={(e) => setShiftEnd(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1 text-[11px]">مدة الاستراحة (تُخصم من الساعات)</label>
                      <select
                        value={shiftBreak}
                        onChange={(e) => setShiftBreak(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                      >
                        <option value={0}>بدون استراحة (0 دقيقة)</option>
                        <option value={15}>15 دقيقة</option>
                        <option value={30}>30 دقيقة (نصف ساعة)</option>
                        <option value={45}>45 دقيقة</option>
                        <option value={60}>60 دقيقة (ساعة كاملة)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Status Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5 text-xs">هل تم تسليم الأجر؟ *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShiftPaymentStatus('unpaid')}
                    className={`py-2 px-2 rounded-2xl font-bold text-xs border text-center transition-all ${
                      shiftPaymentStatus === 'unpaid'
                        ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    🔴 معلق بالحساب
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftPaymentStatus('paid_cash')}
                    className={`py-2 px-2 rounded-2xl font-bold text-xs border text-center transition-all ${
                      shiftPaymentStatus === 'paid_cash'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    🟢 تم التسليم كاش
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftPaymentStatus('paid_bank')}
                    className={`py-2 px-2 rounded-2xl font-bold text-xs border text-center transition-all ${
                      shiftPaymentStatus === 'paid_bank'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    🏦 تحويل بنكي
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">ملاحظات (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: تسليم اليومية باليد، أو تعويض ساعات..."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold shadow-sm active:scale-95 transition-all text-xs"
                >
                  {editingShiftId ? 'حفظ التعديلات' : 'تسجيل الوردية الآن'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT EMPLOYEE */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-tasty-teal-light text-tasty-teal-dark flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-tasty-charcoal">
                    {editingEmpId ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
                  </h3>
                  <p className="text-[11px] text-gray-400">إعدادات سريعة ومبسطة</p>
                </div>
              </div>
              <button
                onClick={() => setIsEmpModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmp} className="space-y-4 text-xs">
              
              {/* Name */}
              <div>
                <label className="block font-bold text-gray-800 mb-1 text-xs">اسم الموظف *</label>
                <input
                  type="text"
                  placeholder="مثال: أبو أحمد الشامي"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white transition-colors"
                />
              </div>

              {/* Role with fast preset chips */}
              <div>
                <label className="block font-bold text-gray-800 mb-1.5 text-xs">المسمى الوظيفي / المهمة *</label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {COMMON_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEmpRole(r)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        empRole === r
                          ? 'bg-tasty-teal text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="أو اكتب المسمى الوظيفي..."
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal focus:bg-white"
                />
              </div>

              {/* Wage Type Selection & Rate */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                <label className="block font-bold text-gray-800 text-xs">طريقة الحساب والأجر *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmpWageType('hourly')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all ${
                      empWageType === 'hourly'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    ⏱️ بالساعة
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmpWageType('daily')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all ${
                      empWageType === 'daily'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    📅 يومية ثابتة
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmpWageType('weekly')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all ${
                      empWageType === 'weekly'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    🏢 أسبوعي ثابت
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-gray-700">
                    {empWageType === 'hourly' ? 'سعر الساعة (€):' : empWageType === 'daily' ? 'قيمة اليومية (€):' : 'المبلغ الأسبوعي (€):'}
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={empRate}
                      onChange={(e) => setEmpRate(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans font-black text-gray-900 focus:outline-hidden focus:border-tasty-teal"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500">€</span>
                </div>
              </div>

              {/* Schedule Type Selection: Fixed vs Flexible */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="block font-bold text-gray-800 text-xs">نظام الدوام وساعات العمل *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmpScheduleType('fixed')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                      empScheduleType === 'fixed'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    🏢 دوام أسبوعي ثابت
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmpScheduleType('flexible')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                      empScheduleType === 'flexible'
                        ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    ⏱️ دوام مرن / مياومة بالطلب
                  </button>
                </div>

                {/* If Fixed Schedule: choose default hours simply */}
                {empScheduleType === 'fixed' ? (
                  <div className="space-y-3 pt-2 border-t border-gray-200 animate-fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-gray-700 text-[11px]">
                          ساعات العمل المعتادة باليوم:
                        </label>
                        <span className="text-[10px] text-gray-400 font-bold">تسجل بضغطة زر يومياً</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[6, 7.5, 8, 9, 10].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setEmpDefaultHours(h)}
                            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
                              empDefaultHours === h
                                ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {h} {h === 8 ? 'ساعات (كامل)' : 'ساعات'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Collapsible Advanced Schedule Details (Start/End times, Days) */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedEmpSchedule(!showAdvancedEmpSchedule)}
                        className="text-[11px] font-bold text-tasty-teal hover:underline flex items-center gap-1"
                      >
                        <span>⚙️ تفاصيل إضافية (أوقات الدخول/الخروج، وأيام الأسبوع)</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedEmpSchedule ? 'rotate-180' : ''}`} />
                      </button>

                      {showAdvancedEmpSchedule && (
                        <div className="mt-2.5 p-3 rounded-xl bg-white border border-gray-200 space-y-2.5 animate-fade-in">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-gray-600 mb-1 text-[10px]">ساعة الدخول</label>
                              <input
                                type="time"
                                value={empDefaultStart}
                                onChange={(e) => setEmpDefaultStart(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-gray-600 mb-1 text-[10px]">ساعة الخروج</label>
                              <input
                                type="time"
                                value={empDefaultEnd}
                                onChange={(e) => setEmpDefaultEnd(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-gray-600 mb-1 text-[10px]">أيام الدوام بالأسبوع</label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                              {WEEK_DAYS.map((wd) => {
                                const isSelected = empWorkingDays.includes(wd.id);
                                return (
                                  <button
                                    key={wd.id}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setEmpWorkingDays(empWorkingDays.filter((d) => d !== wd.id));
                                      } else {
                                        setEmpWorkingDays([...empWorkingDays, wd.id]);
                                      }
                                    }}
                                    className={`py-1 px-0.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                    }`}
                                  >
                                    {wd.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <p className="text-[11px] text-gray-500 pt-1">
                    الموظف ذو الدوام المرن يُسجل دوامه فقط عند حضوره الفعلي بنقرة زر.
                  </p>
                )}
              </div>

              {/* Phone & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">رقم الهاتف (اختياري)</label>
                  <input
                    type="tel"
                    placeholder="06..."
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal text-right"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">حالة العمل</label>
                  <select
                    value={empIsActive ? 'active' : 'inactive'}
                    onChange={(e) => setEmpIsActive(e.target.value === 'active')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-tasty-teal"
                  >
                    <option value="active">نشط بالعمل حالياً</option>
                    <option value="inactive">متوقف / في إجازة</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-tasty-teal hover:bg-tasty-teal-dark text-white font-bold shadow-sm active:scale-95 transition-all text-xs"
                >
                  {editingEmpId ? 'حفظ التعديلات' : 'إضافة الموظف'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT EMPLOYEE ADVANCE (سلفة أو سحب كاش) */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-cairo">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {editingAdvanceId ? 'تعديل بيانات السلفة / الدفعة' : 'تسجيل سلفة نقدية / سحب من الكاش'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    توثيق المبلغ المسحوب وخصمه تلقائياً من مستحقات الموظف
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdvanceModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdvance} className="space-y-4 text-xs">
              
              {/* Select Employee */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">الموظف المستلم *</label>
                <select
                  value={advanceEmpId}
                  onChange={(e) => setAdvanceEmpId(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="">-- اختر الموظف --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input with Quick Pills */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-950 text-xs">
                    المبلغ المسحوب (€) *
                  </label>
                  <span className="text-[10px] text-amber-800 font-medium">خصم مباشر من رصيد الموظف</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={advanceAmount || ''}
                    onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)}
                    required
                    placeholder="مثال: 50"
                    className="w-full bg-white border border-amber-300 rounded-xl px-4 py-2.5 text-lg font-black font-sans text-gray-900 focus:outline-hidden focus:border-amber-500 text-left tabular-nums"
                    dir="ltr"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-400">€</span>
                </div>

                {/* Quick Amount Buttons: 20, 30, 50, 75, 100, 150 */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold shrink-0">مبالغ شائعة:</span>
                  {[20, 30, 50, 75, 100, 150].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAdvanceAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all ${
                        advanceAmount === amt
                          ? 'bg-amber-600 text-white shadow-2xs scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-100/50'
                      }`}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">تاريخ الصرف *</label>
                  <input
                    type="date"
                    value={advanceDate}
                    onChange={(e) => setAdvanceDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold font-sans text-gray-800 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">طريقة الصرف *</label>
                  <select
                    value={advanceMethod}
                    onChange={(e) => setAdvanceMethod(e.target.value as EmployeePaymentMethod)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="cash">💵 نقد من الصندوق (كاش)</option>
                    <option value="bank_transfer">💳 تحويل بنكي</option>
                  </select>
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">نوع الحركة المالية</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setAdvanceType('advance'); setAdvanceNotes(prev => prev || 'سلفة نقدية على الحساب'); }}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border text-center transition-all ${
                      advanceType === 'advance'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    سلفة من الكاش
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdvanceType('salary_settlement'); setAdvanceNotes(prev => prev || 'دفعة من الراتب'); }}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border text-center transition-all ${
                      advanceType === 'salary_settlement'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    دفعة من الراتب
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdvanceType('bonus'); setAdvanceNotes(prev => prev || 'مكافأة / إكرامية'); }}
                    className={`py-2 px-2 rounded-xl font-bold text-[11px] border text-center transition-all ${
                      advanceType === 'bonus'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    مكافأة / إكرامية
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">البيان / ملاحظات</label>
                <input
                  type="text"
                  placeholder="مثال: أخذ 50 يورو سلفة من الصندوق فترة العصر"
                  value={advanceNotes}
                  onChange={(e) => setAdvanceNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm active:scale-95 transition-all text-xs flex items-center gap-1.5"
                >
                  <Banknote className="w-4 h-4" />
                  <span>{editingAdvanceId ? 'حفظ التعديل' : 'تأكيد قيد السلفة'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
