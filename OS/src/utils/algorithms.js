export const AlgorithmLogic = {
  fcfs: (head, queue) => {
    const sequence = [head, ...queue];
    let seekCount = 0;
    const steps = [];
    
    for (let i = 0; i < sequence.length - 1; i++) {
      const distance = Math.abs(sequence[i + 1] - sequence[i]);
      seekCount += distance;
      steps.push({
        from: sequence[i],
        to: sequence[i + 1],
        distance,
        explanation: `Moving from ${sequence[i]} to ${sequence[i + 1]} (distance: ${distance})`
      });
    }
    
    const throughput = queue.length > 0 && seekCount > 0 ? queue.length / seekCount : 0;
    return { sequence, seekCount, avgSeek: queue.length > 0 ? seekCount / queue.length : 0, throughput, steps };
  },

  sstf: (head, queue) => {
    const remaining = [...queue]; 
    const sequence = [head];
    let current = head;
    let seekCount = 0;
    const steps = [];
    
    while (remaining.length > 0) {
      let closestIdx = -1;
      let minDistance = Infinity;
      
      for (let i = 0; i < remaining.length; i++) {
        const distance = Math.abs(remaining[i] - current);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }
      
      if (closestIdx !== -1) {
        const next = remaining[closestIdx];
        const distance = minDistance;
        seekCount += distance;
        steps.push({
          from: current,
          to: next,
          distance: distance,
          explanation: `Moving to ${next} (closest to ${current}, distance: ${distance})`
        });
        sequence.push(next);
        current = next;
        remaining.splice(closestIdx, 1);
      } else {
          break;
      }
    }
    
    const throughput = queue.length > 0 && seekCount > 0 ? queue.length / seekCount : 0;
    return { sequence, seekCount, avgSeek: queue.length > 0 ? seekCount / queue.length : 0, throughput, steps };
  },

  scan: (head, queue, direction, diskSize = 199) => {
    const requests = [...queue].sort((a, b) => a - b);
    const sequence = [head];
    let seekCount = 0;
    const steps = [];
    
    const left = requests.filter(r => r < head);
    const right = requests.filter(r => r >= head);
    
    let path = [];
    
    if (direction === 'left') {
      path = [...left.reverse()];
      // If we are going left but there are requests on the right, we must hit 0 then turn around
      if (right.length > 0) {
          path.push(0); 
          path = [...path, ...right];
      } else if (path.length === 0 && right.length > 0) {
           path.push(0);
           path = [...path, ...right];
      }
    } else {
      path = [...right];
      // If we are going right but there are requests on the left, we must hit Max then turn around
      if (left.length > 0) {
          path.push(diskSize);
          path = [...path, ...left.reverse()];
      } else if (path.length === 0 && left.length > 0) {
          path.push(diskSize);
          path = [...path, ...left.reverse()];
      }
    }
    
    let current = head;
    for (const track of path) {
      if (track === current) continue; 
      const distance = Math.abs(track - current);
      seekCount += distance;
      steps.push({
        from: current,
        to: track,
        distance,
        explanation: `SCAN: Moving ${track > current ? 'right' : 'left'} to ${track} (distance: ${distance})`
      });
      sequence.push(track);
      current = track;
    }
    
    const throughput = queue.length > 0 && seekCount > 0 ? queue.length / seekCount : 0;
    return { sequence, seekCount, avgSeek: queue.length > 0 ? seekCount / queue.length : 0, throughput, steps };
  },

  cscan: (head, queue, direction, diskSize = 199) => {
    const requests = [...queue].sort((a, b) => a - b);
    const sequence = [head];
    let seekCount = 0;
    const steps = [];
    
    const right = requests.filter(r => r >= head);
    const left = requests.filter(r => r < head);
    
    let path = [];
    
    if (direction === 'left') {
        // C-SCAN LEFT: Move Left -> Hit 0 -> Jump to Max -> Move Left
        path = [...left.reverse()];
        
        // If there are requests on the right side, we wrap around
        if (right.length > 0) {
            // Ensure we hit 0 if we aren't there
            if (path.length === 0 || path[path.length-1] !== 0) {
                 path.push(0);
            }
            // Jump to end (diskSize)
            path.push(diskSize);
            // Continue leftwards from end
            path = [...path, ...right.reverse()];
        }
    } else {
        // C-SCAN RIGHT: Move Right -> Hit Max -> Jump to 0 -> Move Right
        path = [...right];
        
        // If there are requests on the left side, we wrap around
        if (left.length > 0) {
             // Ensure we hit Max if we aren't there
            if (path.length === 0 || path[path.length-1] !== diskSize) {
                 path.push(diskSize);
            }
            // Jump to start (0)
            path.push(0);
            // Continue rightwards from start
            path = [...path, ...left];
        }
    }
    
    let current = head;
    for (const track of path) {
      if (track === current) continue;

      let distance = Math.abs(track - current);
      let explanation = `C-SCAN: Moving ${direction} to ${track}`;
      
      // Detect Jump for better explanation
      // Right Jump: High -> Low
      if (direction === 'right' && track < current) {
          explanation = `C-SCAN: Jumping to ${track} (Wrap Around)`;
      }
      // Left Jump: Low -> High
      if (direction === 'left' && track > current) {
          explanation = `C-SCAN: Jumping to ${track} (Wrap Around)`;
      }

      seekCount += distance;
      steps.push({
        from: current,
        to: track,
        distance,
        explanation
      });
      sequence.push(track);
      current = track;
    }
    
    const throughput = queue.length > 0 && seekCount > 0 ? queue.length / seekCount : 0;
    return { sequence, seekCount, avgSeek: queue.length > 0 ? seekCount / queue.length : 0, throughput, steps };
  }
};