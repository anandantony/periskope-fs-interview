'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Phone, Settings, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

interface TopNavProps {
    className?: string;
    phoneNumber?: string | undefined;
    onPhoneNumberChange?: (phone?: string) => void;
}

export function TopNav({ className, phoneNumber, onPhoneNumberChange }: TopNavProps) {
    const [phones, setPhones] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const ALL_VALUE = 'ALL_PHONE_NUMBERS';

    useEffect(() => {
        let mounted = true;
        const fetchPhones = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('phone_numbers')
                .select('number')
                .order('id', { ascending: true });

            if (!mounted) return;
            setLoading(false);
            if (error) {
                console.error('Failed to load phone numbers', error.message);
                return;
            }

            const nums = (data || []).map((r: any) => r.number);
            setPhones(nums);

            // If caller hasn't selected a phone yet, choose first by default
            if ((!phoneNumber || phoneNumber === '') && nums.length > 0) {
                onPhoneNumberChange?.(nums[0]);
            }
        };

        fetchPhones();
        return () => { mounted = false; };
    }, []);

    return (
        <div className={cn(
            "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-2",
            className
        )}>
            {/* Left - Breadcrumb */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Periskope</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-semibold text-gray-900">groups</span>
                </div>
            </div>

            {/* Right - Actions and Info */}
            <div className="flex items-center gap-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Docs
                    </Button>

                    {/* Phone Number Selector */}
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <Select
                            value={phoneNumber ?? ''}
                            onValueChange={(v) =>
                                onPhoneNumberChange?.(v === ALL_VALUE ? undefined : v)
                            }
                        >
                            <SelectTrigger className="text-sm text-gray-600">
                                <SelectValue placeholder={loading ? 'Loading…' : 'Select phone'} />
                            </SelectTrigger>
                            <SelectContent position='popper'>
                                {/* Allow viewing all numbers when empty value selected */}
                                <SelectItem value={ALL_VALUE}>
                                    <span className="text-sm">All phone numbers</span>
                                </SelectItem>
                                {phones.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        <span className="text-sm">{p}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Bell className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
