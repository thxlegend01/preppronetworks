import TestCard from "@/components/TestCard";

const mockTests = [
  { id: "1", title: "Full Syllabus Test 1", duration: 180, questions: 75, subject: "Physics", difficulty: "Hard" as const },
  { id: "2", title: "Algebra & Calculus", duration: 90, questions: 30, subject: "Mathematics", difficulty: "Medium" as const },
  { id: "3", title: "Organic Chemistry Basics", duration: 60, questions: 25, subject: "Chemistry", difficulty: "Easy" as const },
  { id: "4", title: "Mechanics & Waves", duration: 90, questions: 30, subject: "Physics", difficulty: "Medium" as const },
  { id: "5", title: "Inorganic Chemistry", duration: 60, questions: 25, subject: "Chemistry", difficulty: "Hard" as const },
  { id: "6", title: "Coordinate Geometry", duration: 90, questions: 30, subject: "Mathematics", difficulty: "Medium" as const },
  { id: "7", title: "Full Syllabus Test 2", duration: 180, questions: 75, subject: "Physics", difficulty: "Hard" as const },
  { id: "8", title: "Physical Chemistry", duration: 60, questions: 25, subject: "Chemistry", difficulty: "Easy" as const },
  { id: "9", title: "Trigonometry & Vectors", duration: 90, questions: 30, subject: "Mathematics", difficulty: "Medium" as const },
];

const TestList = () => {
  return (
    <section id="tests" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Available <span className="text-gradient">Test Series</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose from our collection of Mathango 2026 tests. Practice in real CBT environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <div 
              key={test.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TestCard {...test} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestList;
