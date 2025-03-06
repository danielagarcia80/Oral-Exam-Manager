class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int width = right - left;
            maxWater = Math.max(maxWater, h * width);
            // Move the pointer with the shorter line (to potentially find a taller one)
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
}
