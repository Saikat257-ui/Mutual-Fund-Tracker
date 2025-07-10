import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', current: false },
    ...(user ? [{ name: 'Saved Funds', href: '/saved-funds', current: false }] : []),
  ];

  return (
    <Disclosure as="nav" className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between w-full">
              {/* Left: Logo and navigation links */}
              <div className="flex items-center space-x-8">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-300">
                    MutualFunds
                  </Link>
                </motion.div>
                <div className="hidden sm:flex sm:space-x-8">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={classNames(
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-all duration-300',
                          item.current
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: User menu or Sign in */}
              <div className="flex items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </Menu.Button>
                    </motion.div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={logout}
                              className={classNames(
                                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm font-medium transition-all duration-300'
                              )}
                            >
                              Sign out
                            </motion.button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="btn-primary"
                    >
                      Sign in
                    </Link>
                  </motion.div>
                )}
                {/* Mobile menu button */}
                <div className="flex sm:hidden ml-2">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-300">
                    <span className="sr-only">Open main menu</span>
                    <AnimatePresence mode="wait">
                      {open ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 90 }}
                          exit={{ rotate: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: -90 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Disclosure.Button
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                </motion.div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
