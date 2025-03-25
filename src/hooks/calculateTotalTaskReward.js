export function totalTaskReward(tasks) {
    if (!Array.isArray(tasks)) {
      return { message: "tasks must be an array" };
    }
  
    let total = 0;
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      total += Number(task?.reward) || 0; // Adds 0 if reward is NaN or undefined
    }
  
    return total;
  }
  