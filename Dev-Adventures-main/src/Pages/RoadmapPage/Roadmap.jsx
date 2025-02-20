import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Database,
  FileCode2,
  FolderTree,
  GraduationCap,
  Layout,
  LineChart,
  Puzzle,
  CheckCircle2,
  Star,
  ChevronRight,
  Terminal,
  MonitorSmartphone
} from "lucide-react";

const RoadmapPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const nodes = [
    {
      title: "Programming Basics",
      description: "Coding Fundamentals",
      icon: Code2,
      topics: [
        {
          icon: Terminal,
          title: "Coding Fundamentals",
          description: "Master the basics of programming",
        },
        {
          icon: MonitorSmartphone,
          title: "IDE Familiarity",
          description: "Getting familiar with an IDE",
        },
        {
          icon: FileCode2,
          title: "First Project",
          description: "Build your first functional project",
        }
      ],
      level: "Beginner",
      isCompleted: true,
      link: "/plans"
    },
    {
      title: "Functions & Methods",
      description: "Learn OOP concepts",
      icon: Puzzle,
      topics: [
        {
          icon: BookOpen,
          title: "Object-Oriented Programming",
          description: "Get familiar with OOP",
        },
        {
          icon: Database,
          title: "Data Structures",
          description: "Learn what data structures are",
        },
        {
          icon: GraduationCap,
          title: "Algorithms",
          description: "Algorithms and their purpose",
        }
      ],
      level: "Intermediate",
      isCompleted: false,
    },
    {
      title: "Advanced Concepts",
      description: "Multiple learning paths",
      icon: FolderTree,
      topics: [
        {
          icon: Layout,
          title: "Multiple Paths",
          description: "Choose your specialization",
        },
        {
          icon: BookOpen,
          title: "Detailed Instructions",
          description: "Step-by-step guidance",
        },
        {
          icon: FileCode2,
          title: "Portfolio Projects",
          description: "CV approved functional projects",
        }
      ],
      level: "Advanced",
      isCompleted: false,
    },
    {
      title: "Data Structures & Algorithms",
      description: "Efficient problem solving",
      icon: LineChart,
      topics: [
        {
          icon: Database,
          title: "Basic Structures",
          description: "Arrays and linked lists",
        },
        {
          icon: LineChart,
          title: "Algorithms",
          description: "Sorting and searching",
        },
      ],
      level: "Expert",
      isCompleted: false,
    },
  ];

  const LevelBadge = ({ level, isCompleted }) => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      isCompleted 
        ? "bg-blue-500/20 text-blue-500" 
        : "bg-blue-500/10 text-blue-500"
    }`}>
      <Star className="w-4 h-4 mr-1" />
      {level}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Your Programming Journey
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Master programming step by step: from basic concepts to advanced algorithms
            </p>
          </div>

          <div className="relative mt-32">
            {/* Main Timeline Line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-blue-500/20 -translate-x-1/2" />

            {/* Start Node */}
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-8 h-8 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-24">
              {nodes.map((node, index) => (
                <div key={node.title} className="relative group">
                  {/* Connection Node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-6 h-6 rounded-full ${
                      node.isCompleted ? "bg-blue-500" : "bg-blue-500/50"
                    } shadow-lg shadow-blue-500/50 flex items-center justify-center`}>
                      {node.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`relative ${
                    index % 2 === 0 ? "ml-[52%]" : "mr-[52%]"
                  } w-[90%] sm:w-[45%]`}>
                    <div className="bg-gray-800 rounded-xl shadow-lg border border-blue-500/20 hover:border-blue-500 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                      <div className="p-6">
                        <div className="flex items-start space-x-4 mb-6">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                            node.isCompleted 
                              ? "bg-blue-500/20 text-blue-500" 
                              : "bg-blue-500/10 text-blue-500"
                          }`}>
                            <node.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">{node.title}</h2>
                            <p className="text-gray-400">{node.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {node.topics.map((topic) => (
                            <div
                              key={topic.title}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-500/5 transition-colors"
                            >
                              <topic.icon className="w-5 h-5 mt-1 text-gray-400" />
                              <div>
                                <p className="font-medium text-white">{topic.title}</p>
                                <p className="text-sm text-gray-400">{topic.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <LevelBadge level={node.level} isCompleted={node.isCompleted} />
                          {node.link ? (
                            <a 
                              href={node.link}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsLoading(true);
                                setTimeout(() => {
                                  window.location.href = node.link;
                                }, 1000);
                              }}
                              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-blue-500 hover:bg-blue-500/10 transition-colors"
                            >
                              Start Learning
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </a>
                          ) : (
                            <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-blue-500 hover:bg-blue-500/10 transition-colors">
                              Start Learning
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* End Node */}
              <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-8 h-8 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;