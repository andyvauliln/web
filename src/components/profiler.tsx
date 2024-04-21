'use client'
import React, { Profiler, ProfilerProps, ReactNode } from 'react';

interface CustomProfilerProps extends Omit<Partial<Required<ProfilerProps>>, 'children'> {
    children: ReactNode;
    onRender?: ProfilerProps['onRender'];
}

//@ts-ignore
const callback: ProfilerProps['onRender'] = (
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: 'mount' | 'update' | "nested-update", // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration: number, // time spent rendering the committed update
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering this update
    commitTime: number, // when React committed this update
    interactions: Set<any> // the Set of interactions belonging to this update
) => {
    console.log(`${id}: ${phase} \nFrom Scratch: ${baseDuration.toFixed(3)}ms \n With Memo (Actual): ${actualDuration.toFixed(3)}ms`);
};

export const CustomProfiler: React.FC<CustomProfilerProps> = ({ children, onRender = callback, id = 'defaultProfilerId', ...props }) => {
    const isProfilerEnabled = process.env.NEXT_PUBLIC_IS_PROFILER_ENABLED === 'true';

    if (isProfilerEnabled) {
        return (
            <Profiler id={id} onRender={callback} {...props}>
                {children}
            </Profiler>
        );
    }

    return <>{children}</>;
};